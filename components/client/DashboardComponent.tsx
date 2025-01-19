import React from 'react'
import Table from './TableComponent'

const DashboardComponent = () => {
  return (
    <div className='text-black py-7'>
        <div className='flex flex-row justify-between items-center mb-5 px-5'>
            
            <div className='w-fit px-5 py-2 bg-[#fff3e4] hover:text-white hover:cursor-pointer text-[#ff6c2f] text-sm hover:bg-[#ff6c2f] rounded-xl'>+ Create Order</div>
        </div>
        <Table />
    </div>
  )
}

export default DashboardComponent