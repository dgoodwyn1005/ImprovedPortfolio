import { AdminSidebar } from "@/components/admin/sidebar"
import { SubmissionsManager } from "@/components/admin/submissions-manager"

export default function SubmissionsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Contact Submissions</h1>
          <p className="text-muted-foreground">Manage messages and quote requests from visitors</p>
        </div>
        <SubmissionsManager />
      </main>
    </div>
  )
}
