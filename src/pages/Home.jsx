import Hero from '../components/Hero'
import ConsultationForm from '../components/ConsultationForm'
import AttorneySection from '../components/AttorneySection'
import MarqueeSection from '../components/MarqueeSection'
import FeaturesSection from '../components/FeaturesSection'
import ReviewSection from '../components/ReviewSection'
import BlogSection from '../components/BlogSection'
import FAQSection from '../components/FAQSection'
import AppDownload from '../components/AppDownload'

export default function Home() {
  return (
    <main>
      <Hero />
      <ConsultationForm />
      <MarqueeSection />
      <AttorneySection />
      <FeaturesSection />
      <ReviewSection />
      <BlogSection />
      <FAQSection />
      <AppDownload />
    </main>
  )
}
