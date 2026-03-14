'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function Checkout() {
  const { id: cardId } = useParams()
  const router = useRouter()

  // State Management
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Pakistan'
  })

  const [paymentMethod, setPaymentMethod] = useState('COD')

  // Calculated Values
  const totalPrice = useMemo(() => (card ? card.price * quantity : 0), [card, quantity])

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/cards?id=${cardId}`)
        if (!response.ok) throw new Error('Product not found')
        const data = await response.json()
        setCard(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (cardId) fetchCard()
  }, [cardId])

  const handleOrder = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/Order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingName: shippingAddress.name,
          shippingAddress: shippingAddress.address,
          shippingEmail: shippingAddress.email,
          shippingPhone: shippingAddress.phone,
          shippingCity: shippingAddress.city,
          shippingPostalCode: shippingAddress.postalCode,
          shippingCountry: shippingAddress.country,
          products: [{
            productId: cardId,
            name: card.name,
            price: card.price,
            quantity,
            image: card.image
          }],
          totalPrice,
          paymentMethod
        })
      })

      const result = await response.json()

      if (response.ok) {
        alert('Order placed successfully!')
        router.push('/dashboard')
      } else {
        throw new Error(result.message || 'Failed to place order')
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Secure Checkout...</div>

  if (!card) return <div className="min-h-screen flex items-center justify-center">Card not found</div>

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-12 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
        
        {/* LEFT: Shipping & Payment Details */}
        <div className="lg:col-span-8 space-y-6">
          <header>
            <h1 className="text-3xl font-black tracking-tight">Checkout</h1>
            <p className="text-slate-500 mt-1 text-sm">Review your order and select a payment method.</p>
          </header>

          <form onSubmit={handleOrder} className="space-y-6">
            {/* Shipping Information Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">1. Shipping Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input required placeholder="Recipient Name" className="checkout-input col-span-2" 
                  value={shippingAddress.name} onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})} />
                
                <input required type="email" placeholder="Email Address" className="checkout-input" 
                  value={shippingAddress.email} onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})} />
                
                <input required type="tel" placeholder="Phone Number" className="checkout-input" 
                  value={shippingAddress.phone} onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})} />
                
                <input required placeholder="Street Address" className="checkout-input col-span-2" 
                  value={shippingAddress.address} onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})} />
                
                <input required placeholder="City" className="checkout-input" 
                  value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} />
                
                <input required placeholder="Postal Code" className="checkout-input" 
                  value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})} />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">2. Payment Method</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {['COD', 'Card', 'JazzCash', 'EasyPaisa'].map((method) => (
                  <label key={method} className={`relative flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === method ? 'border-black bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}>
                    <input type="radio" name="payment" className="sr-only" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                    <span className="font-bold text-sm">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-6 rounded-3xl font-black text-xl hover:scale-[1.01] transition-transform active:scale-[0.99] disabled:bg-slate-300">
              {isSubmitting ? "Processing..." : `Confirm Order — $${totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* RIGHT: Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <aside className="sticky top-8 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl space-y-6">
            <h2 className="text-xl font-bold">Order Summary</h2>
            
            <div className="flex gap-4">
              <img src={card.image} className="h-20 w-20 rounded-2xl object-cover" alt={card.name} />
              <div>
                <h4 className="font-bold">{card.name}</h4>
                <p className="text-slate-400 text-xs">{card.category}</p>
                <p className="font-bold mt-1">${card.price}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-medium">Quantity</span>
                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-8 w-8 font-bold">-</button>
                  <span className="font-bold text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="h-8 w-8 font-bold">+</button>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold">${(card.price * quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest mt-1">Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-end">
                <span className="font-bold">Total</span>
                <span className="text-3xl font-black tracking-tighter">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-[10px] text-center text-slate-300 uppercase font-black tracking-widest pt-4">
              Secure SSL Encrypted
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .checkout-input {
          @apply w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-black focus:bg-white outline-none transition-all text-sm font-medium;
        }
      `}</style>
    </div>
  )
}