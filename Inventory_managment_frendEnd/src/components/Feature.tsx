
import { FaUserFriends, FaBoxOpen, FaChartLine, FaFileExport, FaShieldAlt, FaClipboardList } from 'react-icons/fa';

const FeaturesSection = () => {
    const features = [
        {
            icon: <FaUserFriends className="text-[#5fc551] text-4xl" />,
            title: "User-Friendly Interface",
            description: "Manage inventory, sales, and customers with ease.",
        },
        {
            icon: <FaBoxOpen className="text-[#5fc551] text-4xl" />,
            title: "Comprehensive Inventory Management",
            description: "Add, edit, and track items effortlessly.",
        },
        {
            icon: <FaChartLine className="text-[#5fc551] text-4xl" />,
            title: "Sales Tracking",
            description: "Record sales and generate detailed reports.",
        },
        {
            icon: <FaClipboardList className="text-[#5fc551] text-4xl" />,
            title: "Customer Ledger",
            description: "Maintain a detailed history of customer transactions.",
        },
        {
            icon: <FaFileExport className="text-[#5fc551] text-4xl" />,
            title: "Data Export",
            description: "Export reports in PDF, Excel, or email formats.",
        },
        {
            icon: <FaShieldAlt className="text-[#5fc551] text-4xl" />,
            title: "Secure and Reliable",
            description: "Built with cutting-edge technology to keep your data safe.",
        },
    ];

    return (
        <div className="bg-[#ffff] text-black py-16">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-8">
                    Why Choose Our Inventory Management System?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (

                        <div
                            key={index}
                            className="bg-[#1a202c] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                            <p className="text-sm text-white">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
