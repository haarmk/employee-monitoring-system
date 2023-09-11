import datetime
from typing import Generator
from app.services import vpn as vpn_service
from app.crud.crud_vpn import vpn_user, attendance_date, attendance
from app.db.session import SessionLocal
from app.models import vpn as vpn_models
from app.core.config import settings


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
 
 
today_date = False


def get_todays_attendance_date():
    global today_date
    if not today_date:
        db = next(get_db())
        today_date = attendance_date.get_last_date(db=db)
        if not today_date:
            db = next(get_db())
            db_today = vpn_models.AttendanceDate(date=datetime.date.today())
            today_date = attendance_date.create(db=db, obj_in=db_today)

        
    if today_date.date != datetime.date.today():
        db = next(get_db())
        db_today = vpn_models.AttendanceDate(date=datetime.date.today())
        today_date = attendance_date.create(db=db, obj_in=db_today)

    return today_date
        

def update_attendance():
    today_date = get_todays_attendance_date()
    vpn_connection_details = vpn_service.ovpn_mgmt.get_status()
    for key in vpn_connection_details.keys():
        details = vpn_connection_details[key]
        # print(details)
        username = details["username"]
        db=db=next(get_db())
        user = vpn_user.get_by_username(db=db, username=username)
        today_attendance = attendance.get_Attendance_by_date_and_user(db=db, vpn_user_id=user.id, date_id=today_date.id)
        
        if today_attendance is None:
            atdn = vpn_models.Attendance(
                vpn_user_id = user.id,
                date_id = today_date.id,
                first_connected_at = details["connected_since"],
                last_seen_at = details["last_seen"], 
                
            )
            attendance.create(db=db,obj_in=atdn)
            
        else:
            obj_in = {}
            obj_in["last_seen_at"] = details["last_seen"]
            
            obj_in["total_up_time"] = today_attendance.total_up_time + settings.ATTENDANCE_UPDATE_INTERVAL_SECONDS
            
            attendance.update(db=db,obj_in=obj_in, db_obj=today_attendance)
        

def hello():
    # print(datetime.date().today())
    pass