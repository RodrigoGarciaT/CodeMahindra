"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Plus, Pencil, Save, Package, Upload, Trash2, Store, DollarSign, Calendar, Hash } from "lucide-react"
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

const StoreManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])

  // Fetch products from API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(`${import.meta.env.VITE_BACKEND_URL}/products/`)
        setProducts(response.data)
      } catch (error) {
        console.error("Error fetching problems:", error)
      }
    }

    fetchProducts()
  }, [])

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isAddingStock, setIsAddingStock] = useState<number | null>(null)
  const [stockAmount, setStockAmount] = useState<number>(0)
  const [newProduct, setNewProduct] = useState<Omit<Product, "id" | "publishDate">>({
    image: "",
    name: "",
    price: 0,
    description: "",
    quantity: 0,
  })

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsCreating(false)
    setIsAddingStock(null)
  }

  const handleSave = async (product: Product) => {
    try {
      const response = await axios.put<Product>(`${import.meta.env.VITE_BACKEND_URL}/products/${product.id}`, {
        image: product.image,
        name: product.name,
        price: product.price,
        description: product.description,
        quantity: product.quantity,
      })

      const savedProduct = response.data

      setProducts((currentProducts) =>
        currentProducts.map((p) =>
          p.id === product.id
            ? {
                ...savedProduct,
                quantity: product.quantity, // if you still want to override quantity
              }
            : p,
        ),
      )
    } catch (error) {
      console.error("Failed to save product:", error)
    }

    setEditingProduct(null)
  }

  const handleCreate = async (product: Product) => {
    // Create a new product object with a generated id and publish date.
    const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1
    const createdProduct = {
      ...product,
      id: newId,
      publishDate: new Date().toISOString().split("T")[0],
    }

    try {
      // Post the new product data to the backend
      console.log("this is the created product: ", createdProduct)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/products/`, {
        image: createdProduct.image,
        name: createdProduct.name,
        price: createdProduct.price,
        description: createdProduct.description,
        quantity: createdProduct.quantity,
      })

      // Optionally update the state with the response from the backend.
      // Here we're assuming the backend returns the created product as response.data.
      setProducts((currentProducts) => [...currentProducts, response.data])
    } catch (error) {
      console.error("Error creating product", error)
      alert("Failed to create product.")
    } finally {
      // Reset the form for creating a new product and exit creation mode.
      setNewProduct({
        image: "",
        name: "",
        price: 0,
        description: "",
        quantity: 0,
      })
      setIsCreating(false)
    }
  }

  const handleAddStock = async (productId: number) => {
    if (stockAmount <= 0) return

    try {
      const response = await axios.post<Product>(
        `${import.meta.env.VITE_BACKEND_URL}/products/${productId}/add_stock`,
        {
          quantity: stockAmount,
        },
      )

      const updatedProduct = response.data

      setProducts((currentProducts) =>
        currentProducts.map((p) => (p.id === productId ? { ...p, quantity: updatedProduct.quantity } : p)),
      )
    } catch (error) {
      console.error("Failed to add stock:", error)
    }

    setStockAmount(0)
    setIsAddingStock(null)
  }

  const handleDiscontinue = async (productId: number) => {
    const confirmed = window.confirm("Are you sure you want to discontinue this product?")

    if (confirmed) {
      try {
        // Send DELETE request to backend to delete the product
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`)

        // If successful, update the state to remove the product
        setProducts((currentProducts) => currentProducts.filter((p) => p.id !== productId))

        // Optionally reset editingProduct if the discontinued product is currently being edited
        if (editingProduct?.id === productId) {
          setEditingProduct(null)
        }
      } catch (error) {
        console.error("Error discontinuing product:", error)
        alert("Failed to discontinue the product. Please try again.")
      }
    }
  }

  const ProductForm = ({
    product,
    onSave,
    onCancel,
  }: {
    product: Product
    onSave: (product: Product) => void
    onCancel: () => void
  }) => {
    const [uploading, setUploading] = useState(false)
    const cloudName = import.meta.env.VITE_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET

    const handleImageUpload = async (
      e: React.ChangeEvent<HTMLInputElement>,
      setProductData: (data: any) => void,
      currentData: any,
    ): Promise<void> => {
      console.log("uploading image")
      const file = e.target.files?.[0]
      if (!file) {
        console.log("found nothing", e.target.files)
        return
      }
      console.log("actually did find an image")
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", uploadPreset)

      try {
        const response = await axios.post<{ secure_url: string }>(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData,
        )
        console.log(response.data.secure_url)
        setProductData({ ...currentData, image: response.data.secure_url })
      } catch (error) {
        console.error("Upload error:", error)
        alert("Upload failed. Check console for details.")
      } finally {
        setUploading(false)
      }
    }

    const [editedProduct, setEditedProduct] = useState({ ...product })
    useEffect(() => {
      console.log("final updated data:", editedProduct)
    }, [editedProduct])

    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 border border-gray-200">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            {product.id ? (
              <>
                <Pencil className="w-6 h-6 mr-3 text-red-600" />
                Edit Product
              </>
            ) : (
              <>
                <Plus className="w-6 h-6 mr-3 text-red-600" />
                Create New Product
              </>
            )}
          </h3>
          <p className="text-gray-600 mt-1">
            {product.id ? "Update product information" : "Add a new product to your store"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Product Image</label>
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                {editedProduct.image ? (
                  <img
                    src={editedProduct.image || "/placeholder.svg?height=120&width=120"}
                    alt="Product preview"
                    className="w-32 h-32 object-cover rounded-xl ring-2 ring-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-xl ring-2 ring-gray-200">
                    <span className="text-sm text-gray-500 text-center">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <label className="flex flex-col items-center justify-center w-full h-32 px-6 transition bg-gray-50 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-red-400 hover:bg-red-50">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-600 font-medium">
                    {uploading ? "Uploading..." : "Click to upload image"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, setEditedProduct, editedProduct)}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Product Name</label>
            <input
              type="text"
              value={editedProduct.name}
              onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Price ($)</label>
            <input
              type="number"
              value={editedProduct.price}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, price: Math.floor(Number.parseFloat(e.target.value)) })
              }
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200"
              step="1"
              min="0"
              placeholder="0"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
            <textarea
              value={editedProduct.description}
              onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200"
              rows={4}
              placeholder="Describe your product..."
            />
          </div>

          {!product.id && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Initial Stock</label>
              <input
                type="number"
                value={editedProduct.quantity}
                onChange={(e) => setEditedProduct({ ...editedProduct, quantity: Number.parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200"
                min="0"
                placeholder="0"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => onCancel()}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedProduct)}
            disabled={uploading}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
          >
            <Save className="w-4 h-4" />
            {uploading ? "Uploading..." : "Save Product"}
          </button>
        </div>
      </div>
    )
  }

  const totalProducts = products.length
  const totalValue = products.reduce((acc, product) => acc + product.price * product.quantity, 0)
  const lowStockProducts = products.filter((product) => product.quantity < 10).length

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center mr-4">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Store Management</h1>
                <p className="text-gray-400 mt-1">Manage your product catalog and inventory</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsCreating(true)
                setEditingProduct(null)
                setIsAddingStock(null)
              }}
              className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
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
                  <DollarSign className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Inventory Value</p>
                  <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Package className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Low Stock Items</p>
                  <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isCreating && (
          <ProductForm
            product={{
              ...newProduct,
              id: 0,
              publishDate: new Date().toISOString().split("T")[0],
            }}
            onSave={handleCreate}
            onCancel={() => setIsCreating(false)}
          />
        )}

        <div className="space-y-6">
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-2xl border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-gray-600">Start building your store by adding your first product.</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id}>
                {editingProduct?.id === product.id ? (
                  <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => setEditingProduct(null)} />
                ) : (
                  <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 hover:shadow-3xl transition-all duration-300">
                    <div className="flex items-center">
                      <div className="relative flex-shrink-0">
                        <img
                          src={product.image || "/placeholder.svg?height=96&width=96"}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-xl ring-2 ring-gray-200"
                        />
                        {product.quantity < 10 && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            !
                          </div>
                        )}
                      </div>
                      <div className="ml-6 flex-grow">
                        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-1 text-red-500" />
                            <span className="font-medium">${product.price}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Package className="w-4 h-4 mr-1 text-red-500" />
                            <span className={`font-medium ${product.quantity < 10 ? "text-red-600" : ""}`}>
                              Stock: {product.quantity}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-1 text-red-500" />
                            <span>{new Date(product.publishDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Hash className="w-4 h-4 mr-1 text-red-500" />
                            <span>ID: {product.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => {
                            setIsAddingStock(product.id)
                            setEditingProduct(null)
                            setIsCreating(false)
                          }}
                          className="p-3 text-green-600 hover:text-green-700 rounded-xl hover:bg-green-50 transition-all duration-200"
                          title="Add Stock"
                        >
                          <Package className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-3 text-gray-600 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200"
                          title="Edit Product"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDiscontinue(product.id)}
                          className="p-3 text-red-600 hover:text-red-700 rounded-xl hover:bg-red-50 transition-all duration-200"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {isAddingStock === product.id && (
                      <div className="mt-6 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Package className="w-5 h-5 mr-2 text-red-600" />
                          Add Stock to {product.name}
                        </h4>
                        <div className="flex items-end gap-4">
                          <div className="flex-grow">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Amount</label>
                            <input
                              type="number"
                              value={stockAmount}
                              onChange={(e) => setStockAmount(Math.max(0, Number.parseInt(e.target.value) || 0))}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200"
                              min="0"
                              placeholder="Enter quantity to add"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setIsAddingStock(null)}
                              className="px-4 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAddStock(product.id)}
                              disabled={stockAmount <= 0}
                              className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 ${
                                stockAmount <= 0
                                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
                              }`}
                            >
                              <Plus className="w-4 h-4" />
                              Add Stock
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default StoreManagement
