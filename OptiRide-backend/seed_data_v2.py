# seed_data_v2.py
import psycopg2
from psycopg2.extras import execute_values
from faker import Faker
import random, os, math

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:admin123@localhost/optiride")
fake = Faker()

def connect():
    return psycopg2.connect(DB_URL)

def random_coord(center_lat, center_lon, spread_km=5):
    """Generate random lat/lon near a center point."""
    r = random.random()
    ang = random.random() * 2 * math.pi
    dx_km = r * spread_km * math.cos(ang)
    dy_km = r * spread_km * math.sin(ang)
    lat = center_lat + (dy_km / 111)
    lon = center_lon + (dx_km / (111 * math.cos(math.radians(center_lat)) + 1e-9))
    return round(lat, 6), round(lon, 6)

def seed():
    conn = connect()
    cur = conn.cursor()

    # ---------------------
    # SEED USERS
    # ---------------------
    cur.execute("SELECT COUNT(*) FROM users;")
    count = cur.fetchone()[0]
    if count == 0:
        users = [(fake.name(), fake.phone_number(), fake.email(), "pass123") for _ in range(10)]
        execute_values(cur,
           "INSERT INTO users (name, phone, email, password) VALUES %s", users)
        conn.commit()
        print("Users seeded.")
    else:
        print("Users already exist.")

    # ---------------------
    # SEED DRIVERS
    # ---------------------
    cur.execute("SELECT COUNT(*) FROM drivers;")
    count = cur.fetchone()[0]

    center_lat, center_lon = 12.9716, 77.5946  # Bangalore center

    if count == 0:
        drivers = []
        for i in range(4):
            name = f"Driver {i+1}"
            lat, lon = random_coord(center_lat, center_lon, spread_km=7)
            drivers.append((name, f"9{random.randint(100000000,999999999)}", lat, lon))
        execute_values(cur,
            "INSERT INTO drivers (name, phone, latitude, longitude) VALUES %s",
            drivers)
        conn.commit()
        print("Drivers seeded.")
    else:
        print("Drivers already exist.")

    # ---------------------
    # SEED RIDE REQUESTS
    # ---------------------
    cur.execute("SELECT COUNT(*) FROM ride_requests;")
    if cur.fetchone()[0] == 0:
        ride_rows = []
        cur.execute("SELECT user_id FROM users;")
        user_ids = [r[0] for r in cur.fetchall()]

        for _ in range(6):
            uid = random.choice(user_ids)
            pickup = fake.street_name()
            drop = fake.street_name()
            p_lat, p_lon = random_coord(center_lat, center_lon, spread_km=8)
            d_lat, d_lon = random_coord(center_lat, center_lon, spread_km=8)
            ride_rows.append((uid, pickup, drop, p_lat, p_lon, d_lat, d_lon))

        execute_values(cur, """
            INSERT INTO ride_requests (user_id, pickup, drop, pickup_lat, pickup_lon, drop_lat, drop_lon)
            VALUES %s
        """, ride_rows)
        conn.commit()
        print("Ride requests seeded.")
    else:
        print("Ride requests already exist.")

    # ---------------------
    # SEED DELIVERY REQUESTS
    # ---------------------
    cur.execute("SELECT COUNT(*) FROM delivery_requests;")
    if cur.fetchone()[0] == 0:
        del_rows = []
        cur.execute("SELECT user_id FROM users;")
        user_ids = [r[0] for r in cur.fetchall()]

        for _ in range(6):
            uid = random.choice(user_ids)
            address = fake.address().replace("\n", ", ")
            lat, lon = random_coord(center_lat, center_lon, spread_km=8)
            del_rows.append((uid, "Milk,Bread", address, lat, lon))

        execute_values(cur, """
            INSERT INTO delivery_requests (user_id, products, address, dest_lat, dest_lon)
            VALUES %s
        """, del_rows)
        conn.commit()
        print("Delivery requests seeded.")
    else:
        print("Delivery requests already exist.")

    cur.close()
    conn.close()
    print("\n⭐ Seed v2 COMPLETED successfully!")

if __name__ == "__main__":
    seed()
