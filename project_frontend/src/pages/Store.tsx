"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ShoppingCart, AlertCircle, StoreIcon, Package, DollarSign, Calendar, Hash } from "lucide-react"
import { useCart } from "../contexts/CartContext"
import axios from "axios"

interface Product {
  id: number
  image: string
  name: string
  price: number
  description: string
  quantity: number
  publishDate: string
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { items, addToCart } = useCart()
  const cartItem = items.find((item) => item.id === product.id)
  const currentQuantity = cartItem?.quantity || 0
  const isOutOfStock = product.quantity === 0
  const hasReachedLimit = currentQuantity >= product.quantity
  const isLowStock = product.quantity <= 5

  const handleAddToCart = () => {
    if (!hasReachedLimit && !isOutOfStock) {
      addToCart(product)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-3xl border border-gray-200">
      <div className="relative">
        <img
          src={product.image || "/placeholder.svg?height=192&width=384"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm">Out of Stock</span>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Low Stock
          </div>
        )}
        {currentQuantity > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {currentQuantity} in cart
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-red-600">${product.price}</span>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(product.publishDate).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Package className="w-4 h-4 mr-1 text-red-500" />
              <span className={`font-medium ${isLowStock ? "text-red-600" : ""}`}>
                Available: {product.quantity - currentQuantity}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Hash className="w-4 h-4 mr-1 text-red-500" />
              <span>ID: {product.id}</span>
            </div>
          </div>

          <div className="text-sm text-gray-500">Total Stock: {product.quantity} units</div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={hasReachedLimit || isOutOfStock}
          className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-medium ${
            hasReachedLimit || isOutOfStock
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          {isOutOfStock ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Out of Stock
            </>
          ) : hasReachedLimit ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Max Quantity Reached
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  )
}

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products from API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(`${import.meta.env.VITE_BACKEND_URL}/products/`)
        setProducts(response.data)
      } catch (error) {
        console.error("Error fetching problems:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  console.log("these are the products: ", products)

  const totalProducts = products.length
  const inStockProducts = products.filter((product) => product.quantity > 0).length
  const averagePrice =
    products.length > 0 ? products.reduce((acc, product) => acc + product.price, 0) / products.length : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 border border-gray-200">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                <StoreIcon className="h-8 w-8 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Store</h3>
              <p className="text-gray-600">Fetching the latest products...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center mr-4">
              <StoreIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Store</h1>
              <p className="text-gray-400 mt-1">Discover our amazing products</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Package className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <ShoppingCart className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">In Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{inStockProducts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <DollarSign className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Avg. Price</p>
                  <p className="text-2xl font-bold text-gray-900">${averagePrice.toFixed(0)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-2xl border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <StoreIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">Check back later for new products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Store
