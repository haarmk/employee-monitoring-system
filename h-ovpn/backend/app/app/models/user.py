from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(length=100), index=True)
    email = Column(String(length=100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(length=1000), nullable=False)
    is_active = Column(Boolean(), default=True)
    is_test_paaed = Column(Boolean(), default=False)
    is_superuser = Column(Boolean(), default=False)
    


