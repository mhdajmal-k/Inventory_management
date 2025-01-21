
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#0d121c] text-[#e5e5e5] py-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row justify-between items-center">

                    <div className="mb-6 lg:mb-0">
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#home" className="hover:text-[#5fc551] transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#features" className="hover:text-[#5fc551] transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="hover:text-[#5fc551] transition-colors">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="hover:text-[#5fc551] transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>

                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                        <p>Email:ajmalchundappuram@gmail.com</p>
                        <p>Phone: 7025862597</p>
                        <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer">
                                <FaFacebookF className="text-2xl hover:text-[#5fc551] transition-colors" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer">
                                <FaTwitter className="text-2xl hover:text-[#5fc551] transition-colors" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                                <FaLinkedinIn className="text-2xl hover:text-[#5fc551] transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>


                <div className="mt-10 text-center text-sm text-[#7a7a7a]">
                    © {new Date().getFullYear()} Inventory Management System. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
