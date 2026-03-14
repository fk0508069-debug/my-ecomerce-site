"use client";

import React, { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  shippingName: string;
  shippingAddress: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  products: Product[];
  totalPrice: number;
  paymentMethod: string;
  orderStatus: string;
  createdAt: string;
}

interface User {
 role: string;
  name: string;
}

export default function Dashboard() {
 const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me');
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const res = await fetch('/api/Order');
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return(
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="mb-8">
            <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
              <h2 className="text-lg font-bold text-blue-900 mb-4">Admin Dashboard</h2>
              <Link
                href="/add-card"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
              >
                ＋ Add New Product
              </Link>
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-2xl font-bold mb-6">All Orders</h3>
              
              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order._id} 
                      onClick={() => setSelectedOrder(order)}
                      className="border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">Order {order._id.slice(0, 8)}</h4>
                          <p className="text-sm text-gray-600">{order.shippingName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${order.totalPrice.toFixed(2)}</p>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Section */}
        {user?.role === 'user' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h1 className="text-3xl font-bold mb-4">Welcome back!</h1>
            <p className="text-gray-600 mb-6">You are logged in as a regular user. Return to home to browse products.</p>
            <Link 
              href="/home"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Go to Home
            </Link>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Header */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="text-lg font-bold text-gray-900">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Status and Payment */}
              <div className="grid md:grid-cols-2 gap-6 py-6 border-y border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Order Status</p>
                  <span className={`inline-block px-4 py-2 rounded-full font-semibold border ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                  <p className="text-lg font-bold text-gray-900">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h3 className="text-lg font-bold mb-4">Shipping Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.shippingName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.shippingEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.shippingPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.shippingAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.shippingCity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Postal Code</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.shippingPostalCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Country</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.shippingCountry}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-lg font-bold mb-4">Products</h3>
                <div className="space-y-4">
                  {selectedOrder.products.map((product, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">SKU: {product.productId}</p>
                        <div className="mt-2 flex gap-6">
                          <div>
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Quantity</p>
                            <p className="font-semibold text-gray-900">{product.quantity}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Subtotal</p>
                            <p className="font-semibold text-gray-900">${(product.price * product.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Price */}
              <div className="flex justify-end py-4 border-t border-gray-200">
                <div className="text-right">
                  <p className="text-gray-600 mb-2">Total Amount</p>
                  <p className="text-4xl font-bold text-gray-900">${selectedOrder.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}