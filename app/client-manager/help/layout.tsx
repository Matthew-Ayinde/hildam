import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help & Documentation - Hildam Couture",
  description: "Comprehensive help and documentation for the Hildam Couture management system",
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="help-section">
      {children}
    </div>
  )
}
