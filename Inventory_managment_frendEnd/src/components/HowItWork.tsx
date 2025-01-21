
import { FaSignInAlt, FaBox, FaChartLine, FaFileAlt } from 'react-icons/fa'

const steps = [
    {
        icon: <FaSignInAlt className="text-[#5fc551] text-4xl" />,
        title: "Login to Your Account",
        description: "Access your personalized dashboard.",
    },
    {
        icon: <FaBox className="text-[#5fc551] text-4xl" />,
        title: "Add Inventory Items",
        description: "Input details like name, description, quantity, and price.",
    },
    {
        icon: <FaChartLine className="text-[#5fc551] text-4xl" />,
        title: "Track Sales",
        description: "Record sales and monitor performance.",
    },
    {
        icon: <FaFileAlt className="text-[#5fc551] text-4xl" />,
        title: "Generate Reports",
        description: "View insights with detailed reports and export them as needed.",
    },
]

const HowItWorksSection = () => {
    return (
        <section className="bg-[#0d121c] text-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center bg-[#1a202c] p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="mb-6 p-4 bg-[#2d3748] rounded-full">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                            <p className="text-sm text-[#e5e5e5] text-center">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection

