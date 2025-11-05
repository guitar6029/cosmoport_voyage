import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Use absolute import to the existing module
from server.models.models import Voyage

# import the init_db
from server.database import init_db


app = FastAPI()

##add some middleware
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
	await init_db()

#routes
@app.get("/")
async def root():
	return {"message": "FastAPI  is running "}


@app.get("/voyages")
async def list_voyages():
	return await Voyage.find_all().to_list()
