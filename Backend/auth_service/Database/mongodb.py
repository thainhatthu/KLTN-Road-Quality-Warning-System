import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    def __init__(self):
        try:
            self.host = os.getenv('MONGODB_HOST')
            self.port = os.getenv('MONGODB_PORT')
            self.username = os.getenv('MONGODB_USER')
            self.password = os.getenv('MONGODB_PASSWORD')
            self.db_name = os.getenv('MONGODB_DB')
            self.client = pymongo.MongoClient(f"mongodb://{self.username}:{self.password}@{self.host}:{self.port}/")
            self.db = self.client[self.db_name]
        except Exception as e:
            print("Error while connecting to MongoDB", e)

    def insert(self, collection_name, data):
        collection = self.db[collection_name]
        return collection.insert_one(data)

    def find(self, collection_name,query,protections=None):
        collection = self.db[collection_name]
        return collection.find(query,protections)

    def update(self,collection_name, query, data):
        collection = self.db[collection_name]
        return collection.update_one(query, data,upsert=True)

    def delete(self,collection_name, query):
        collection = self.db[collection_name]
        return collection.delete_one(query)
    
    def find_one(self,collection_name,query,projections=None):
        collection = self.db[collection_name]
        return collection.find_one(query,projections)
    
    def insert_many(self,collection_name,data):
        collection = self.db[collection_name]
        return collection.insert_many(data)

    def disconnect(self):
        self.client.close()