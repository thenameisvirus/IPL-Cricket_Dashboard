from datetime import datetime, timedelta
import jwt

SECRET_KEY = "IPL_SECRET_KEY_2026"

ALGORITHM = "HS256"

EXPIRE_MINUTES = 60


def create_token(username):

    payload = {
        "sub": username,
        "exp": datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


def verify_token(token):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except:

        return None