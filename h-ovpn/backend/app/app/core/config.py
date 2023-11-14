import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic.v1 import AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, PostgresDsn, validator


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    SERVER_NAME: str
    SERVER_HOST: AnyHttpUrl
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    FRONTEND_BASE_URL: str
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    PROJECT_NAME: str
    SENTRY_DSN: Optional[HttpUrl] = None

    @validator("SENTRY_DSN", pre=True)
    def sentry_dsn_can_be_blank(cls, v: str) -> Optional[str]:
        if len(v) == 0:
            return None
        return v

    # POSTGRES_SERVER: str
    # POSTGRES_USER: str
    # POSTGRES_PASSWORD: str
    # POSTGRES_DB: str
    # SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None


    MYSQL_SERVER: str
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_DB: str
    SQLALCHEMY_DATABASE_URI: Optional[str] = None



    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def hello(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return f"mysql+mysqlconnector://{values.get('MYSQL_USER')}:{values.get('MYSQL_PASSWORD')}@{values.get('MYSQL_SERVER')}:3306/{values.get('MYSQL_DB')}"
        # return PostgresDsn.build(
        #     scheme="postgresql",
        #     user=values.get("POSTGRES_USER"),
        #     password=values.get("POSTGRES_PASSWORD"),
        #     host=values.get("POSTGRES_SERVER"),
        #     path=f"/{values.get('POSTGRES_DB') or ''}",
        # )



    SMTP_SSL: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[EmailStr] = None
    EMAILS_FROM_NAME: Optional[str] = None

    @validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: Optional[str], values: Dict[str, Any]) -> str:
        if not v:
            return values["PROJECT_NAME"]
            
        return v

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 24
    EMAIL_TEMPLATES_DIR: str 
    EMAILS_ENABLED: bool = True

    @validator("EMAILS_ENABLED", pre=True)
    def get_emails_enabled(cls, v: bool, values: Dict[str, Any]) -> bool:
        return bool(
            values.get("SMTP_HOST")
            and values.get("SMTP_PORT")
            and values.get("EMAILS_FROM_EMAIL")
        )

    EMAIL_TEST_USER: EmailStr = "test@example.com"  # type: ignore
    FIRST_SUPERUSER: EmailStr = "indicate0@gmail.com"
    FIRST_SUPERUSER_PASSWORD: str
    USERS_OPEN_REGISTRATION: bool = False


    # vpn
    OVPN_HOST: str
    OVPN_PORT: str
    OVPN_MANAGEMENT_HOST:str
    OVPN_MANAGEMENT_PORT: int
    OVPN_AUTOMATION_SCRIPTS_PATH: str
    ATTENDANCE_UPDATE_INTERVAL_SECONDS: int

    # geoip2
    GEOIP2_DATABASE_PATH: str

    class Config:
        case_sensitive = True
        env_file = ".env"
        # class Config:
        


settings = Settings()
