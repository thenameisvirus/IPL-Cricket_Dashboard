from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from auth.jwt_handler import create_token

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


# Demo User
USERNAME = "admin"
PASSWORD = "admin123"


@router.post("/login")
def login(data: LoginRequest):

    if data.username == USERNAME and data.password == PASSWORD:

        token = create_token(data.username)

        return {
            "message": "Login Successful",
            "access_token": token,
            "token_type": "bearer",
        }

    raise HTTPException(
        status_code=401,
        detail="Invalid Username or Password",
    )
    