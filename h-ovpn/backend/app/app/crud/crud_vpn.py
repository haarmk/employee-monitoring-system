from typing import Any, Dict, Optional, Union
from sqlalchemy import DATE, func
from sqlalchemy.orm import aliased
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.vpn import VpnUser, AttendanceDate, Attendance
from app.schemas.user import UserCreate, UserUpdate


ad = aliased(AttendanceDate, name="ad")
vu = aliased(VpnUser, name="vu")
a = aliased(Attendance, name="a")

class CRUDAttendance(CRUDBase[Attendance, Attendance, Attendance]):

    

    def create(self, db: Session, *, obj_in: Attendance) -> Attendance:
        db_obj = obj_in
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: Attendance, obj_in: Union[Attendance, Dict[str, Any]]
    ) -> Attendance:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
            
        return super().update(db, db_obj=db_obj, obj_in=update_data)
    
    def remove(self, db: Session, *, id: int) -> Attendance:
            obj = db.query(self.model).get(id)
            db.delete(obj)
            db.commit()
            return obj

    def get_Attendance_by_date_and_user(self, db: Session, *, date_id: int, vpn_user_id: int) -> Attendance:
        return db.query(Attendance).filter((Attendance.date_id == date_id) & (Attendance.vpn_user_id == vpn_user_id)).first()

    def get_Attendance_by_month_year_and_username(self, db: Session, *, month: int, year: int , vpn_user_name: str) -> Any:
        # date_column = ad.date.label('attendance_date')
        # first_connected_at_column = a.first_connected_at.label('first_connection_time')
        # last_seen_at_column = a.last_seen_at.label('last_seen_time')
        # total_up_time_column = a.total_up_time.label('total_up_time')
        # query = (db.query(date_column, first_connected_at_column, last_seen_at_column, total_up_time_column)

        query = (db.query(ad.date, a.first_connected_at, a.last_seen_at, a.total_up_time)
        .join( vu, vu.id == a.vpn_user_id)
        .join( ad, ad.id == a.date_id)
        .filter(func.MONTH(ad.date) == month, func.YEAR(ad.date) == year, vu.username == vpn_user_name))
        result = query.all()
        
        return result
        



class CRUDVpnUser(CRUDBase[VpnUser,VpnUser,VpnUser]):
        def create(self, db: Session, *, obj_in: VpnUser) -> VpnUser:
            db_obj = obj_in
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        

        def update(
            self, db: Session, *, db_obj: VpnUser, obj_in: Union[VpnUser, Dict[str, Any]]
        ) -> VpnUser:
            if isinstance(obj_in, dict):
                update_data = obj_in
            else:
                update_data = obj_in.dict(exclude_unset=True)
            return super().update(db, db_obj=db_obj, obj_in=update_data)


        def remove(self, db: Session, *, id: int) -> VpnUser:
            obj = db.query(self.model).get(id)
            db.delete(obj)
            db.commit()
            return obj
        
        def get_by_username(self, db: Session, *, username: str) -> Optional[VpnUser]:
            return db.query(VpnUser).filter(VpnUser.username == username).first()


class CRUDAttendanceDate(CRUDBase[AttendanceDate,AttendanceDate,AttendanceDate]):
        def create(self, db: Session, *, obj_in: AttendanceDate) -> AttendanceDate:
            db_obj = obj_in
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        
        def update(
            self, db: Session, *, db_obj: AttendanceDate, obj_in: Union[AttendanceDate, Dict[str, Any]]
        ) -> AttendanceDate:
            if isinstance(obj_in, dict):
                update_data = obj_in
            else:
                update_data = obj_in.dict(exclude_unset=True)
            return super().update(db, db_obj=db_obj, obj_in=update_data)
        


        def remove(self, db: Session, *, id: int) -> AttendanceDate:
            return super().remove(db, id)
        


        def get_by_date(self,  db: Session, *, date:str) -> AttendanceDate:
            return db.query(AttendanceDate).filter(AttendanceDate.date == date).first()
        
        def get_by_id(self,  db: Session, *, id:str) -> AttendanceDate:
            return db.query(AttendanceDate).filter(AttendanceDate.id == id).first()

        def get_last_date(self,  db: Session) -> AttendanceDate:
            return db.query(AttendanceDate).order_by(AttendanceDate.id.desc()).first()
            
             

attendance = CRUDAttendance(Attendance)
vpn_user = CRUDVpnUser(VpnUser)
attendance_date = CRUDAttendanceDate(AttendanceDate)