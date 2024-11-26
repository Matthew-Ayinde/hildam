import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import DashboardComponent from './DashboardComponent'

const Homepage = () => {
  return (
    <div className='w-full flex flex-row bg-red-50'>
        <div className='w-1/4'>
            <Sidebar />
        </div>
        <div className='w-3/4 mx-10 h-full'>
            <div className='mb-20'>
                <Topbar />
            </div>
            <div className='mb-40'>
                <DashboardComponent />
            </div>
        </div>
    </div>
  )
}

export default Homepage