"use client"

import ExpertAnalytics from '@/components/charts/ExpenseAnalytics'
import Last7Days from '@/components/charts/Last7Days'
import React from 'react'
import RevenueAnalytics from '@/components/charts/RevenueAnalytics'

const page = () => {
  return (
    <div className=''>
        <h1 className="text-4xl font-bold">Analytics</h1>
        <p className="text-gray-600">View your analytics data here.</p>
        <Last7Days />

        {/* Monthly Overview Chart Component */}
    <ExpertAnalytics />

        {/* Add more charts or components as needed */}
        <RevenueAnalytics />

        {/* Footer or additional content */}
    </div>
  )
}

export default page