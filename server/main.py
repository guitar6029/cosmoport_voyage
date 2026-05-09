from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routes.voyages import router as voyages_router
from server.database import init_db


@asynccontextmanager
async def lifespan(_app: FastAPI):
    print("Starting up...")
    await init_db()
    yield
    print("Shutting down...")


app = FastAPI(lifespan=lifespan)

# middleware
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

#routes
@app.get("/")
async def root():
	return {"message": "FastAPI  is running "}

app.include_router(voyages_router)
