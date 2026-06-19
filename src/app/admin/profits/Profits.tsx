'use client'

import Price from '@/components/products/Price'
import { useEffect, useState } from 'react'
import { AdminLoading } from '@/components/admin/AdminUI'
import { FiTrendingUp, FiDollarSign } from 'react-icons/fi'

export default function Profits() {
  const [profits, setProfits] = useState({
    dailyProfit: 0,
    cumulativeProfit: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfits = async () => {
      try {
        const response = await fetch('/api/admin/profits')
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Failed to fetch profits')
        setProfits({
          dailyProfit: data.totalProfit,
          cumulativeProfit: data.cumulativeProfit,
        })
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    fetchProfits()
  }, [])

  if (loading) return <AdminLoading />
  if (error) {
    return (
      <div className="admin-panel p-4 text-sm text-[#B12704] bg-[#FFF4F4]">{error}</div>
    )
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="admin-stat">
          <div className="flex items-center gap-2 text-xs font-medium text-[#FF9900]">
            <FiTrendingUp className="w-4 h-4" />
            Today&apos;s profit
          </div>
          <div className="mt-2">
            <Price amount={profits.dailyProfit} size="lg" />
          </div>
        </div>
        <div className="admin-stat">
          <div className="flex items-center gap-2 text-xs font-medium text-[#007185]">
            <FiDollarSign className="w-4 h-4" />
            Cumulative profit
          </div>
          <div className="mt-2">
            <Price amount={profits.cumulativeProfit} size="lg" />
          </div>
        </div>
      </div>
      <p className="text-xs text-[#565959]">
        Figures are calculated from paid orders minus cost price.
      </p>
    </div>
  )
}
