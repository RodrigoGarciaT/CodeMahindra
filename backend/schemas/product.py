from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    image: Optional[str] = None
    name: str
    price: Optional[int] = None
    description: Optional[str] = None
    quantity: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class ProductOut(ProductBase):
    id: int
    publishDate: datetime

    class Config:
        from_attributes = True
