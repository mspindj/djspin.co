import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Music from './components/Music'
import Deepsidency from './components/Deepsidency'
import NowhereTraveler from './components/NowhereTraveler'
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
          <Music />
          <Deepsidency />
          <NowhereTraveler />
          <Story />
          <Gallery />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
