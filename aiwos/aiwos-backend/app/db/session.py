from typing import AsyncGenerator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

# Supabase's connection pooler (port 6543, PgBouncer transaction mode) does not
# support prepared statements, so statement caching must be disabled for asyncpg.
async_engine = create_async_engine(
    settings.async_database_url,
    pool_pre_ping=True,
    future=True,
    connect_args={"statement_cache_size": 0},
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

# Create sync engine and sessionmaker (useful for sync scripting / Alembic migrations context)
sync_engine = create_engine(
    settings.sync_database_url,
    pool_pre_ping=True,
    future=True
)

SyncSessionLocal = sessionmaker(
    bind=sync_engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to retrieve database session in FastAPI routers."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
