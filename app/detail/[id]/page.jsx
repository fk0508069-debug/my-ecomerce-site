'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function Details() {
  const params = useParams()
  const router = useRouter()
  const cardId = params.id
  
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/cards?id=${cardId}`)
        if (!response.ok) throw new Error('Card not found')
        const data = await response.json()
        setCard(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (cardId) fetchCard()
  }, [cardId])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  if (error || !card) return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-semibold text-gray-800">Oops! {error || "Card not found"}</h2>
      <button onClick={() => router.back()} className="mt-4 text-blue-500 hover:underline">Go Back</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          &larr; Back to Collection
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            
            {/* Left: Image Section */}
            <div className="relative h-[400px] md:h-auto bg-gray-100">
              <img
                src={card.image}
                alt={card.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Right: Content Section */}
            <div className="p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 uppercase tracking-wider">
                    {card.category}
                  </span>
                  <span className="text-2xl font-bold text-gray-900">${card.price}</span>
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                  {card.name}
                </h1>
                
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                  {card.description}
                </p>

                {/* Seller Info Card */}
                {card.createdBy && (
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl mb-8">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                      {card.createdBy.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-tighter">Listed by</p>
                      <p className="text-sm font-bold text-gray-800">{card.createdBy.name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Link 
                  href={`/checkout/${cardId}`} 
                  className="block w-full text-center bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
                >
                  Buy Now
                </Link>
                
                {card.createdAt && (
                  <p className="text-center text-xs text-gray-400">
                    Published on {new Date(card.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details