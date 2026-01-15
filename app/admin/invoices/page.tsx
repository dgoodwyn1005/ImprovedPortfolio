import { AdminSidebar } from "@/components/admin/sidebar"
import { InvoiceCreator } from "@/components/admin/invoice-creator"

export default function InvoicesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Create Invoice</h1>
        <InvoiceCreator />
      </main>
    </div>
  )
}
