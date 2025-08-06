"use client"

import type React from "react"
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"
import "../globals.css"
import { useState } from "react"
import Topbar from "@/components/client-manager/Topbar"
import Sidebar from "@/components/client-manager/Sidebar"
import Footer from "@/components/Footer"

import { fetchAllNotifications, readAllNotification, readNotification } from "@/app/api/apiClient"

type Notification = {
  id: string
  message: string
  link: string
  is_read: boolean
  created_at: string
  action_type: string
}

type Props = {
  children: React.ReactNode
}

export default function ClientLayout({ children }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const handleNotificationUpdate = (newNotifications: Notification[], newUnreadCount: number) => {
    setNotifications(newNotifications)
    setUnreadCount(newUnreadCount)
  }

  const handleMarkAsRead = async (id: string, message: string, link: string) => {
    // This would typically call your API

      const resp = await readNotification(id)
    const updatedNotifications = notifications.map((notif) => (notif.id === id ? { ...notif, is_read: true } : notif))
    setNotifications(updatedNotifications)
    setUnreadCount((prev) => prev - 1)

    // Handle navigation logic here
    const linking_id = link.split("/").pop()
    if (link.includes("orders")) {
      window.location.href = "/client-manager/orders/" + linking_id
    }
    // Add other navigation logic as needed
  }

  const handleMarkAllAsRead = async () => {
    // This would typically call your API

      const resp = await readAllNotification()
    const updatedNotifications = notifications.map((notif) => ({ ...notif, is_read: true }))
    setNotifications(updatedNotifications)
    setUnreadCount(0)
  }

  return (
    <html lang="en">
      <head>
        {/* <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style> */}
      </head>
      <body className="min-h-screen bg-gray-50 lg:overflow-x-hidden">
        <div className="flex">
          <Sidebar
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
          
          <div className="flex-1 lg:ml-[300px] lg:mr-5 ml-0 mr-0 md:px-0 px-5">
            <div className="pt-16 lg:pt-0 flex flex-col min-h-screen items-stretch justify-between">
              <div>
                <Topbar onNotificationUpdate={handleNotificationUpdate} />
              <main className="mt-5">{children}</main>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
