from fastapi import FastAPI
import psycopg2
import os
from helpers import build_distance_matrix, solve_vrp
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DB_URL = "postgresql://postgres:admin123@localhost:5432/optiride"


def get_conn():
    return psycopg2.connect(DB_URL)

# -------------------------------------------------
# TEST ROUTE
# -------------------------------------------------
@app.get("/")
def root():
    return {"status": "OptiRide backend running (70%)"}

# -------------------------------------------------
# ASSIGN TASKS (MULTI-DRIVER OR-TOOLS)
# -------------------------------------------------
@app.post("/assign-tasks")
def assign_tasks():
    conn = get_conn()
    cur = conn.cursor()

    # 1️⃣ Fetch drivers
    cur.execute("""
        SELECT id, latitude, longitude
        FROM drivers
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    """)
    drivers = cur.fetchall()

    if not drivers:
        return {"error": "No drivers with coordinates"}

    num_vehicles = len(drivers)

    # 2️⃣ Fetch ride requests
    cur.execute("""
        SELECT ride_id, pickup_lat, pickup_lon
        FROM ride_requests
    """)
    rides = cur.fetchall()

    # 3️⃣ Fetch delivery requests
    cur.execute("""
        SELECT delivery_id, dest_lat, dest_lon
        FROM delivery_requests
    """)
    deliveries = cur.fetchall()

    if not rides and not deliveries:
        return {"error": "No requests found"}

    # 4️⃣ Build locations list
    # index 0 = depot (first driver)
    locations = [(drivers[0][1], drivers[0][2])]
    mapping = []

    for r in rides:
        locations.append((r[1], r[2]))
        mapping.append(("ride", r[0]))

    for d in deliveries:
        locations.append((d[1], d[2]))
        mapping.append(("delivery", d[0]))

    # 5️⃣ Distance matrix
    distance_matrix = build_distance_matrix(locations)

    # 6️⃣ Solve VRP
    routes = solve_vrp(distance_matrix, num_vehicles)

    if not routes:
        return {"error": "OR-Tools failed to find solution"}

    # 7️⃣ Clear old tasks
    cur.execute("DELETE FROM driver_tasks")

    # 8️⃣ Store new tasks
    for driver_index, route in enumerate(routes):
        driver_id = drivers[driver_index][0]
        seq = 1

        for node in route:
            if node == 0:
                continue  # skip depot

            req_type, req_id = mapping[node - 1]

            cur.execute("""
                INSERT INTO driver_tasks
                (driver_id, request_type, request_id, sequence_no, status)
                VALUES (%s, %s, %s, %s, 'assigned')
            """, (driver_id, req_type, req_id, seq))

            seq += 1

    print("DRIVERS FROM DB:", drivers)


    conn.commit()
    cur.close()
    conn.close()

    return {
        "status": "Tasks assigned successfully",
        "drivers_used": num_vehicles
    }

# -------------------------------------------------
# GET DRIVER TASKS
# -------------------------------------------------
@app.get("/driver-tasks/{driver_id}")
def get_driver_tasks(driver_id: int):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        SELECT task_id, request_type, request_id, sequence_no, status
        FROM driver_tasks
        WHERE driver_id = %s
        ORDER BY sequence_no
    """, (driver_id,))

    rows = cur.fetchall()
    cur.close()
    conn.close()

    return {
        "driver_id": driver_id,
        "tasks": [
            {
                "task_id": r[0],
                "request_type": r[1],
                "request_id": r[2],
                "sequence_no": r[3],
                "status": r[4]
            } for r in rows
        ]
    }

# -------------------------------------------------
# UPDATE TASK STATUS
# -------------------------------------------------
@app.post("/driver-tasks/{task_id}/status/{status}")
def update_task_status(task_id: int, status: str):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        UPDATE driver_tasks
        SET status = %s
        WHERE task_id = %s
    """, (status, task_id))

    conn.commit()
    cur.close()
    conn.close()

    return {"task_id": task_id, "new_status": status}
