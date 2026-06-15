from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from app.core.config import settings

_ROUNDS = 12  # bcrypt cost factor


# ── password hashing ──────────────────────────────────────────────────────────

def hash_password(plain: str) -> str:
    """Return a bcrypt hash of *plain* suitable for database storage."""
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt(_ROUNDS)).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Return True iff *plain* matches *hashed*. Constant-time comparison."""
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


# ── JWT ───────────────────────────────────────────────────────────────────────

def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    """Return a signed JWT with *subject* (user id) as the ``sub`` claim."""
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> str | None:
    """Decode *token* and return the subject string, or None if invalid/expired."""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload.get("sub")
    except jwt.PyJWTError:
        return None
