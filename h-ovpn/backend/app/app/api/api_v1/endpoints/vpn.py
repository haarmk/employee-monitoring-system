from email.policy import HTTP
from enum import Enum
import io
import logging
from pathlib import Path
import subprocess
from typing import Any, List
from app.core.config import settings
from fastapi import APIRouter, Depends, HTTPException
from app import crud, models, schemas
from fastapi.responses import StreamingResponse
from pydantic import EmailStr
from sqlalchemy.orm import Session
from app.api import deps
from app.crud.crud_vpn import attendance as attendence_crud, vpn_user as vpn_user_crud

from app import utils
from app.models.vpn import VpnUser

from app.services import vpn
from app.models.enums import Os

router = APIRouter()



@router.post("/create-vpn-user", response_model=Any)
def create_vpn_user(
    *,
    db: Session = Depends(deps.get_db),
    user_details: schemas.VpnUserCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    
    
    result:subprocess.CompletedProcess[str] = utils.runBash(f"sudo {settings.OVPN_AUTOMATION_SCRIPTS_PATH}/create_vpn_user.sh", 
            input=f'{user_details.username.lower()}\n{user_details.password}\n{user_details.vpn_user_pem_pass}\n{user_details.ca_pem_pass}\n')
    if result.returncode != 0:
        raise HTTPException(status_code=400, detail=result.stderr)
    vpn_user = VpnUser(
        username = user_details.username,
        full_name = user_details.full_name,
        email = user_details.email,
        is_active = True
    )
    created_vpn_user = vpn_user_crud.create(db=db,obj_in=vpn_user)
    
    ip = f"10.8.0.{created_vpn_user.id + 1}"
    result:subprocess.CompletedProcess[str] = utils.runBash(f"sudo {settings.OVPN_AUTOMATION_SCRIPTS_PATH}/assign_ip_address_to_vpn_user.sh", 
            input=f'{user_details.username.lower()}\n{ip}\n')
    if result.returncode != 0:
        raise HTTPException(status_code=400, detail=result.stderr)
    

    vpn_user_crud.update(db=db, db_obj=created_vpn_user, obj_in={"ip":ip})
    
    return {"res":f"{user_details.username}'s vpn account created successfully!"}


@router.get("/vpn-users")
def get_all_vpn_user(
    current_user: models.User = Depends(deps.get_current_active_superuser)
    ,db: Session = Depends(deps.get_db)
    ,skip=0
    ,limit=10
):
    return vpn_user_crud.get_multi(db=db,limit=limit,skip=skip,)






# @router.get("/ovpn-file", response_model=Any)
# def create_ovpn_file(client: str
#                      ,os: Os
#                      ,current_user: models.User = Depends(deps.get_current_active_superuser)
#                      ,db: Session = Depends(deps.get_db)
#                      ):
#     client = client.lower()
#     found_client = vpn_user_crud.get_by_username(db=db,username=client)
#     if(found_client is None):
#         raise HTTPException(status_code=400, detail=f"{client} not found")

#     ovpn_file:str = vpn.create_ovpn_file(client=client, os=os)
#     return {"res": ovpn_file}

@router.post("/get-google-authenticator-secret-key", response_model=Any)
def get_google_authenticator_secret_key(client: str
                     
                    ,current_user: models.User = Depends(deps.get_current_active_superuser),
                    
                ):
    client = client.lower()
    
    try:
        google_secret_key:str = vpn.get_google_2af_code(client=client)
    except Exception as e:
        raise HTTPException(status_code=400, detail=e.args)

    return {"key": google_secret_key}

@router.get("/download-ovpn-config-file")
def download_ovpn_file(client: str
                       ,os: Os
                    ,current_user: models.User = Depends(deps.get_current_active_superuser)
                    ,db: Session = Depends(deps.get_db)

                    )-> Any:
    client = client.lower()
    found_client = vpn_user_crud.get_by_username(db=db,username=client)
    if(found_client is None):
        raise HTTPException(status_code=400, detail=f"{client} not found")

    ovpn = vpn.create_ovpn_file(client=client,os=os)
    file_like = io.StringIO(ovpn)
    return StreamingResponse(file_like, media_type="text/plain", headers={f"Content-Disposition": f"attachment; filename={client}.ovpn"})

@router.get("/send-ovpn-file-and-google-key-via-email")
def send_ovpn_file_and_google_key_via_email(client: str,os: Os, email: EmailStr= None
                    
                    ,current_user: models.User = Depends(deps.get_current_active_superuser)
                    ,db: Session = Depends(deps.get_db)

                                            )->Any:
    client = client.lower()
    found_client = vpn_user_crud.get_by_username(db=db,username=client)
    if(found_client is None):
        raise HTTPException(status_code=400, detail=f"{client} not found")

    try:
        google_secret_key:str = vpn.get_google_2af_code(client=client)
        ovpn:str = vpn.create_ovpn_file(client=client, os=os)
    except Exception as e:
        raise HTTPException(status_code=400, detail=e.args)

    with open(Path(settings.EMAIL_TEMPLATES_DIR) / "hovpn_config.html") as f:
        template_str = f.read()

    token: str = utils.generate_password_reset_token(username = client, type = "reset_vpn_password")

    utils.send_email(
        email_to = email,
        subject_template = "H-ovpn configuration details",
        html_template = template_str,
        attachments = [(ovpn,f"{client}.ovpn")],
        environment = {
            "project_name": settings.PROJECT_NAME,
            "username": client,
            "set_password_link": f"{settings.FRONTEND_BASE_URL}/auth/reset-vpn-password?token={token}",
            "google_secret_key":google_secret_key,
        },
    )
    return {"res":"VPN configuration sent successfully."}

@router.post("/reset-vpn-password")
def reset_vpn_password(vpn_reset_password: schemas.VpnResetPassword, token: str = None
                     ,current_user: models.User = Depends(deps.get_current_active_superuser),

                        ) -> Any:
    
    if vpn_reset_password is None and token is None:
        raise HTTPException(status_code=400, detail="Please provide valid details to reset the password")
    elif vpn_reset_password is None:
        pass
    elif token is not None:
        


        decoded_token:dict[str,Any] = utils.verify_password_reset_token(token=token)
        jwt_type: str = decoded_token.get("type", None)
        if decoded_token is None or jwt_type != "reset_vpn_password":
            raise HTTPException(status_code=400, detail="token is not valid!")
        elif decoded_token['type'] == "reset_vpn_password":
            result:subprocess.CompletedProcess = utils.runBash(command=f"sudo {settings.OVPN_AUTOMATION_SCRIPTS_PATH}/reset_vpn_client_password.sh", input=f"{decoded_token['sub']}\n{vpn_reset_password.new_password}\n")
            if result.returncode == 0:
                return {"res":"password changed sucessfully"}
            else:
                raise HTTPException(status_code=400, detail="Something went wrong. Please try again.\nIf the problem persists, please contact the system admin.")

@router.delete("/revoke-user")
def revoke_user(username: str, ca_pem_pass:str
                ,current_user: models.User = Depends(deps.get_current_active_superuser),
                ):
    result:subprocess.CompletedProcess[str] = utils.runBash(f"sudo {settings.OVPN_AUTOMATION_SCRIPTS_PATH}/revoke_user.sh", 
            input=f'{username.lower()}\n{ca_pem_pass}\n')
    if result.returncode != 0:
        raise HTTPException(status_code=400, detail=result.stderr)
    return "done"

# @router.post("/forgot-vpn-password")
# def forgot_vpn_password(token: str
#                      ,current_user: models.User = Depends(deps.get_current_active_superuser),
#                         ):
#     pass

@router.post("/build-user")
def build_vpn_user(username: str, ca_pem_pass: str, vpn_user_pem_pass:str
                   ,current_user: models.User = Depends(deps.get_current_active_superuser),
                   ):
    result:subprocess.CompletedProcess[str] = utils.runBash(f"sudo {settings.OVPN_AUTOMATION_SCRIPTS_PATH}/build_client.sh", 
            input=f'{username.lower()}\n{vpn_user_pem_pass}\n{ca_pem_pass}\n')
    if result.returncode != 0:
        raise HTTPException(status_code=400, detail=result.stderr)
    return "done"


@router.delete("/delete-vpn-user")
def delete_vpn_user(username: str, ca_pem_pass: str
                    
                    ,current_user: models.User = Depends(deps.get_current_active_superuser),
                    ):


    result:subprocess.CompletedProcess[str] = utils.runBash(f"sudo {settings.OVPN_AUTOMATION_SCRIPTS_PATH}/delete_os_user.sh", 
            input=f'{username.lower()}\n')
    if result.returncode != 0:
        raise HTTPException(status_code=400, detail=result.stderr)
    result:subprocess.CompletedProcess[str] = utils.runBash(f"sudo {settings.OVPN_AUTOMATION_SCRIPTS_PATH}/revoke_vpn_user.sh", 
        input=f'{username.lower()}\n{ca_pem_pass}\nyes\n')
    if result.returncode != 0:
        raise HTTPException(status_code=400, detail=result.stderr)
    
    # found_user:VpnUser = vpn_user_crud.get_by_username(username.lower())
    # if found_user is None:
    #     raise HTTPException(status_code=400, detail=f"{username} not found.")
    # else:
    #     vpn_user_crud.remove(found_user.id)

    return "done"


@router.get("/active-users")
def get_active_clients(
        current_user: models.User = Depends(deps.get_current_active_superuser),

):
    return vpn.ovpn_mgmt.get_status()
    
@router.get("/get-attendance-by-month-year-and-username", response_model=List[List])
def get_Attendance_by_month_year_and_username( *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
    month: int, year: int , vpn_user_name: str) -> Any:
    """ 
        Response: 
        
        (date, first connected at, last seen at, total time spent(in seconds))
    """
    return attendence_crud.get_Attendance_by_month_year_and_username(db=db,month=month,year=year,vpn_user_name=vpn_user_name)