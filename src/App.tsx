import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Discography from './components/Discography'
import Deepsidency from './components/Deepsidency'
import NowhereTraveler from './components/NowhereTraveler'
import VenueMarquee from './components/VenueMarquee'
import Story from './components/Story'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <Navbar />
        <main>
          <Hero />
          <Discography />
          <Deepsidency />
          <NowhereTraveler />
          <VenueMarquee />
          <Story />
          <Gallery />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
