import json
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"Hello": "World"}

@app.get("/items")
def get_items():
    items = ["Edsel", "De", "Jesus", "perez", "rodrigo"]
    
    # Return a proper JSON response (list of dictionaries)
    result = [{"name": item} for item in items]

    return result  # ✅ FastAPI automatically converts it to JSON