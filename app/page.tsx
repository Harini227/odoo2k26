import { LandingHero } from '@/components/landing-hero'
import { FeaturesGrid } from '@/components/features-grid'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <LandingHero />
        <FeaturesGrid />
      </main>
      <Footer />
    </div>
  )
}
