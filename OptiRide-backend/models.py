from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    email = Column(String)
    password = Column(String)


class RideRequest(Base):
    __tablename__ = "ride_requests"

    ride_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    pickup = Column(String)
    drop = Column(String)


class DeliveryRequest(Base):
    __tablename__ = "delivery_requests"

    delivery_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    products = Column(String)
    address = Column(String)


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)

class DriverTask(Base):
    __tablename__ = "driver_tasks"

    task_id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"))
    request_type = Column(String)
    request_id = Column(Integer)
    status = Column(String, default="assigned")

