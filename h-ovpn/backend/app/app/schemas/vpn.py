from typing import Optional

from pydantic import BaseModel, EmailStr


# Shared properties
class VpnUserBase(BaseModel):
    username: str
    password: str
    vpn_user_pem_pass: str
    email: EmailStr

class VpnResetPassword(BaseModel):
    new_password: str


# Properties to receive via API on creation
class VpnUserCreate(VpnUserBase):
    ca_pem_pass: str
    full_name:str


class VpnUserCreateRes(VpnUserBase):
    google_secret_key: str
    google_secret_qr: str
    

class Attendence(BaseModel):
    pass









# # Properties to receive via API on update
# class UserUpdate(VpnUserBase):
#     password: Optional[str] = None 


# class UserInDBBase(VpnUserBase):
#     id: Optional[int] = None

#     class Config:
#         orm_mode = True


# # Additional properties to return via API
# class VpnUser(UserInDBBase):
#     pass


# # Additional properties stored in DB
# class UserInDB(UserInDBBase):
#     hashed_password: str
