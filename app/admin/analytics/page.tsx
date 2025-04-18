import ExpertAnalytics from '@/components/charts/ExpenseAnalytics'
import Last7Days from '@/components/charts/Last7Days'
import React from 'react'

const page = () => {
  return (
    <div className=''>
        <h1 className="text-4xl font-bold">Analytics</h1>
        <p className="text-gray-600">View your analytics data here.</p>
        <Last7Days />

        {/* Monthly Overview Chart Component */}
    <ExpertAnalytics />

        {/* Add more charts or components as needed */}
    </div>
  )
}

export default page