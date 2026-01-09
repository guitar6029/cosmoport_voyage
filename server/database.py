import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
# Use absolute import so it works when running from project root
from server.models.models import Voyage
load_dotenv()

#get the mongo uri
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

MONGO_URI = os.getenv("MONGODB_URI")

# create the async client
client = AsyncIOMotorClient(MONGO_URI)

async def init_db():
	await init_beanie(
		database=client["cosmoport"],
		document_models=[Voyage],
	)
	print("Connected to the MongoDB cluster ")
	collections = await client["cosmoport"].list_collection_names()
	print("Collections : ", collections)
