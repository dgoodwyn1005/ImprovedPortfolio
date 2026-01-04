import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow login page without auth
  return (
    <div className="min-h-screen bg-background">
      {user?.user_metadata?.is_admin ? (
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
