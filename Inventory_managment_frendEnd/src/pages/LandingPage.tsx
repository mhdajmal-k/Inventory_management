
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/Feature'
import HowItWorksSection from '../components/HowItWork'

const LandingPage = () => {
    return (
        <div>
            <NavBar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <Footer />
        </div>
    )
}

export default LandingPage
