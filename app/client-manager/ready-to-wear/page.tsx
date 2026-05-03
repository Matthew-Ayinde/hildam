import { redirect } from "next/navigation"

export default function AdminReadyToWearRedirectPage() {
  redirect("/client-manager/fabrics/ready-to-wear")
}