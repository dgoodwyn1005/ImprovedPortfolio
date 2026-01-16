import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ShopContent } from "@/components/shop-content"

export const dynamic = "force-dynamic"

export default function ShopPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <ShopContent />
      </div>
      <Footer />
    </main>
  )
}
