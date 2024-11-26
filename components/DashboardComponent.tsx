import React from 'react'
import Table from './TableComponent'

const DashboardComponent = () => {
  return (
    <div className='bg-white text-black py-7 rounded-2xl'>
        <div className='flex flex-row justify-between items-center mb-5 px-5'>
            <div className='font-bold text-xl'>Recent Orders</div>
            <div className='w-fit px-5 py-2 bg-orange-100 text-orange-600 rounded-xl'>+ Create Order</div>
        </div>
        <Table />
    </div>
  )
}

export default DashboardComponent