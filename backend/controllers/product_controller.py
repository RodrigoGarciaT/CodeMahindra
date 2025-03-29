from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.product import Product
from schemas.product import ProductCreate, ProductUpdate
from typing import List

def get_all_products(db: Session) -> List[Product]:
    return db.query(Product).all()

def get_product_by_id(product_id: int, db: Session) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

def create_product(data: ProductCreate, db: Session) -> Product:
    new_product = Product(**data.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

def update_product(product_id: int, data: ProductUpdate, db: Session) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

def delete_product(product_id: int, db: Session):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
