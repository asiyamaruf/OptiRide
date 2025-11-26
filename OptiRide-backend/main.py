from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse

from database import SessionLocal, engine
import models

# Create tables if not existing
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend (Expo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------
# 1️⃣ REGISTER USER
# ---------------------------
@app.post("/register")
def register_user(data: dict, db: Session = Depends(get_db)):
    user = models.User(
        name=data["name"],
        phone=data["phone"],
        email=data["email"],
        password=data["password"]
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User registered", "user": data}


# ---------------------------
# 2️⃣ LOGIN USER
# ---------------------------
@app.post("/login")
def login_user(data: dict, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == data["email"],
        models.User.password == data["password"]
    ).first()

    if user:
        return {"message": "Login success", "user": data}
    else:
        return {"message": "Invalid credentials"}


# ---------------------------
# 3️⃣ REQUEST RIDE
# ---------------------------
@app.post("/request-ride")
def request_ride(data: dict, db: Session = Depends(get_db)):
    ride = models.RideRequest(
        user_id=data["user_id"],
        pickup=data["pickup"],
        drop=data["drop"],
    )
    db.add(ride)
    db.commit()
    db.refresh(ride)

    # Assign driver (simple logic: assign driver 1 or lowest id)
    driver = db.query(models.Driver).order_by(models.Driver.id).first()

    task = models.DriverTask(
        driver_id=driver.id,
        request_type="ride",
        request_id=ride.ride_id
    )
    db.add(task)
    db.commit()

    return {"message": "Ride request received", "assigned_driver": driver.name}



# ---------------------------
# 4️⃣ REQUEST DELIVERY
# ---------------------------
@app.post("/request-delivery")
def request_delivery(data: dict, db: Session = Depends(get_db)):
    delivery = models.DeliveryRequest(
        user_id=data["user_id"],
        products=data["products"],
        address=data["address"],
    )
    db.add(delivery)
    db.commit()
    db.refresh(delivery)

    # Assign driver
    driver = db.query(models.Driver).order_by(models.Driver.id).first()

    task = models.DriverTask(
        driver_id=driver.id,
        request_type="delivery",
        request_id=delivery.delivery_id
    )
    db.add(task)
    db.commit()

    return {"message": "Delivery request received", "assigned_driver": driver.name}



# ---------------------------
# 5️⃣ GET DRIVERS
# ---------------------------
@app.get("/drivers")
def get_drivers(db: Session = Depends(get_db)):
    drivers = db.query(models.Driver).all()

    driver_list = []
    for d in drivers:
        driver_list.append({
            "id": d.id,
            "name": d.name,
            "location": d.location
        })

    return JSONResponse(content={"drivers": driver_list})

@app.get("/driver-tasks/{driver_id}")
def get_driver_tasks(driver_id: int, db: Session = Depends(get_db)):
    tasks = db.query(models.DriverTask).filter(models.DriverTask.driver_id == driver_id).all()

    output = []
    for t in tasks:
        output.append({
            "task_id": t.task_id,
            "request_type": t.request_type,
            "request_id": t.request_id,
            "status": t.status
        })
    return {"tasks": output}
