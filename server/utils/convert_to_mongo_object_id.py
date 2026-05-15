from beanie import PydanticObjectId


def convert_to_mongo_objectid(id: str) -> PydanticObjectId:
    mongo_object_id = PydanticObjectId(id)
    return mongo_object_id
