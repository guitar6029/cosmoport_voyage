from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routes.voyages import router as voyages_router
from server.database import init_db


app = FastAPI()

# middleware
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

# use lifespan instead
# on_event is depreicated
@app.on_event("startup")
async def startup_event():
	await init_db()

#routes
@app.get("/")
async def root():
	return {"message": "FastAPI  is running "}

app.include_router(voyages_router)
