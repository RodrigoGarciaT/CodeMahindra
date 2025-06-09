"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Package, Check, ChevronUp, ChevronDown, Calendar, User, Hash, Loader2, ShoppingBag, Clock } from "lucide-react"
import Toast from "@/components/Toast"

interface Product {
  product_id: number
  name: string
  image: string
  quantity: number
  delivered: boolean
}

interface Purchase {
  purchase_date: string
  purchase_id: number
  employee_id: string
  profileEpic: string
  firstName: string
  lastName: string
  products: Product[]
}

const PurchaseManager: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [collapsedCards, setCollapsedCards] = useState<Set<number>>(new Set())
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set())

  const [toast, setToast] = useState<{ show: boolean; success: boolean; msg: string }>({
    show: false,
    success: true,
    msg: "",
  })

  const showToast = (success: boolean, msg: string) => {
    setToast({ show: true, success, msg })
    // auto‑hide after 2.5 s
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500)
  }

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/purchases/details/`)
      const data: Purchase[] = response.data

      const autoCollapsed = new Set<number>()
      data.forEach((purchase) => {
        const allDelivered = purchase.products.every((p) => p.delivered)
        if (allDelivered) autoCollapsed.add(purchase.purchase_id)
      })

      setPurchases(data)
      setCollapsedCards(autoCollapsed)
    } catch (error) {
      console.error("Error fetching purchases:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsDelivered = async (purchaseId: number, employeeId: string, productId: number) => {
    const itemKey = `${purchaseId}-${productId}`
    setProcessingItems((prev) => new Set(prev).add(itemKey))

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/purchases/items/`, {
        purchase_id: purchaseId,
        employee_id: employeeId,
        product_id: productId,
      })

      setPurchases((current) => {
        return current.flatMap((purchase) => {
          if (purchase.purchase_id === purchaseId) {
            const updatedProducts = purchase.products.map((product) =>
              product.product_id === productId ? { ...product, delivered: true } : product,
            )

            const allDelivered = updatedProducts.every((p) => p.delivered)

            // Remove this purchase entirely if all items are delivered
            if (allDelivered) return []

            return [{ ...purchase, products: updatedProducts }]
          }
          return [purchase]
        })
      })

      // Clean up collapsed state too (optional, just in case)
      setCollapsedCards((prev) => {
        const newSet = new Set(prev)
        newSet.delete(purchaseId)
        return newSet
      })

      showToast(true, "Item marked as delivered successfully")
    } catch (error) {
      showToast(false, "Error marking item as delivered")
      console.error("Error marking as delivered:", error)
    } finally {
      setProcessingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemKey)
        return newSet
      })
    }
  }

  const toggleCard = (purchaseId: number) => {
    setCollapsedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(purchaseId)) {
        newSet.delete(purchaseId)
      } else {
        newSet.add(purchaseId)
      }
      return newSet
    })
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 border border-gray-200">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-full animate-pulse opacity-30"></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Purchases</h3>
              <p className="text-gray-600">Fetching the latest purchase data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalPurchases = purchases.length
  const totalPendingItems = purchases.reduce(
    (acc, purchase) => acc + purchase.products.filter((p) => !p.delivered).length,
    0,
  )

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center mr-4">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Purchase Manager</h1>
              <p className="text-gray-400 mt-1">Track and manage product deliveries</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Package className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Active Purchases</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPurchases}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Pending Items</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPendingItems}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Cards */}
        <div className="space-y-6">
          {purchases.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-2xl border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Purchases</h3>
              <p className="text-gray-600">All purchases have been completed and delivered.</p>
            </div>
          ) : (
            purchases.map((purchase) => {
              const pendingProducts = purchase.products.filter((product) => !product.delivered)
              const isCollapsed = collapsedCards.has(purchase.purchase_id)

              return (
                <div
                  key={purchase.purchase_id}
                  className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={purchase.profileEpic || "/placeholder.svg?height=48&width=48"}
                            alt={`${purchase.firstName} ${purchase.lastName}`}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            {purchase.firstName} {purchase.lastName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Hash className="h-3 w-3 mr-1" />
                              {purchase.purchase_id}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(purchase.purchase_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Pending Items</p>
                          <p className="text-lg font-semibold text-gray-900">{pendingProducts.length}</p>
                        </div>
                        <button
                          onClick={() => toggleCard(purchase.purchase_id)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                        >
                          {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  {!isCollapsed && (
                    <div className="p-6">
                      {pendingProducts.length === 0 ? (
                        <div className="flex items-center justify-center py-8 text-red-600">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Check className="w-6 h-6 text-red-600" />
                            </div>
                            <p className="font-medium">All products delivered</p>
                            <p className="text-sm text-gray-500 mt-1">This purchase is complete</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {pendingProducts.map((product) => {
                            const itemKey = `${purchase.purchase_id}-${product.product_id}`
                            const isProcessing = processingItems.has(itemKey)

                            return (
                              <div
                                key={product.product_id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-200"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="relative">
                                    <img
                                      src={product.image || "/placeholder.svg?height=64&width=64"}
                                      alt={product.name}
                                      className="w-16 h-16 object-cover rounded-lg ring-1 ring-gray-200"
                                    />
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                      {product.quantity}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900 text-lg">{product.name}</h4>
                                    <p className="text-gray-500 text-sm">Quantity: {product.quantity} items</p>
                                  </div>
                                </div>

                                <button
                                  onClick={() =>
                                    handleMarkAsDelivered(
                                      purchase.purchase_id,
                                      purchase.employee_id,
                                      product.product_id,
                                    )
                                  }
                                  disabled={isProcessing}
                                  className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] justify-center"
                                >
                                  {isProcessing ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <Package className="w-4 h-4 mr-2" />
                                      Mark Delivered
                                    </>
                                  )}
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      <Toast
        show={toast.show}
        success={toast.success}
        msg={toast.msg}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  )
}

export default PurchaseManager
