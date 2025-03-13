import json
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"Hello": "World"}

@app.get("/items")
def get_items():
    items = ["Edsel", "De", "Jesus", "perez", "rodrigo"]
    
    # Create a list of dictionaries with each item having 'name' as the key
    result = [{"name": item} for item in items]
    
    # Convert the list of dictionaries to a JSON-like format
    json_result = json.dumps(result)
    return json_result