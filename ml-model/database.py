# db.py
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")

# Select database
db = client["Haircare_AI"]

# Select collections
users_collection = db["users"]
predictions_collection = db["predictions"]
