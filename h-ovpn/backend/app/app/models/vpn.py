from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base




class VpnUser(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(length=100), index=False)
    username = Column(String(length=100), index=True)
    email = Column(String(length=100), unique=True, index=True, nullable=False)
    ip = Column(String(length=50), index=True, unique=True,nullable=True)
    is_active = Column(Boolean(), default=True)


class AttendanceDate(Base):
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, unique=True)

class Attendance(Base):
    id = Column(Integer, primary_key=True, index=True)
    vpn_user_id = Column(Integer, ForeignKey("vpnuser.id"))
    date_id = Column(Integer, ForeignKey("attendancedate.id"))
    first_connected_at = Column(DateTime())
    last_seen_at = Column(DateTime())
    total_up_time = Column(Integer, default=0)
    



