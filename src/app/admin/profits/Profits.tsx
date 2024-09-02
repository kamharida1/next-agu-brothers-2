'use client'
import { formatPrice } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function Profits() {
  const [profits, setProfits] = useState({
    dailyProfit: 0,
    cumulativeProfit: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfits = async () => {
      try {
        const response = await fetch('/api/admin/profits')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profits')
        }

        setProfits({
          dailyProfit: data.totalProfit,
          cumulativeProfit: data.cumulativeProfit,
        })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfits()
  }, [])

  if (loading)
    return (
      <div className="flex justify-center items-center">
        <progress className="progress w-56"></progress>
      </div>
    )
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profits Overview</h1>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Daily Profit</div>
          <div className="stat-value text-primary py-4">
            {formatPrice(profits.dailyProfit)}
          </div>
          <div className="stat-desc">Profit made today</div>
        </div>

        <div className="stat">
          <div className="stat-title">Cumulative Profit</div>
          <div className="stat-value text-primary py-4">
            {formatPrice(profits.cumulativeProfit)}
          </div>
          <div className="stat-desc">Total profit to date</div>
        </div>
      </div>
    </div>
  )
}


