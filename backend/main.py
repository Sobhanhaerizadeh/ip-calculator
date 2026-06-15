from fastapi import FastAPI
from app.routes.subnet import router as sub
app =FastAPI()
app.include_router(
    sub,
    prefix="/api"
)