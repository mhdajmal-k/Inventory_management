
import hero from '../assets/images/Hero.png'

const HeroSection = () => {
    return (
        <div className="min-h-screen bg-[#0d121c] flex items-center">
            <section className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-[#ffffff] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-6">
                            Effortless Inventory Management at Your Fingertips
                        </h1>
                        <h3 className="text-[#e5e5e5] text-xl sm:text-2xl mb-5">
                            "Streamline your inventory, sales, and customer data in one powerful platform."
                        </h3>
                        <div className="flex justify-center lg:justify-start">
                            <button className="bg-[#5fc551] text-[#ffffff] rounded-lg px-6 py-2 text-lg font-medium hover:bg-[#4fa541] transition-colors duration-300">
                                Get started
                            </button>
                        </div>
                    </div>

                    <div className="mt-8">

                        <img src={hero} alt="Hero" className="w-full h-auto max-w-lg rounded-lg shadow-xl" />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HeroSection