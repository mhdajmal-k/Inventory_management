import { Button } from "antd"
import { Link } from "react-router-dom"

const NavBar = () => {
    const user = localStorage.getItem("user");
    const handleLogout = () => {
        localStorage.removeItem("user")
    }

    return (

        <nav className="bg-[#0d121c] text-white flex justify-between items-center p-2">

            <div className="text-xl text-[#5fc551] font-bold pl-5 ml-5">
                <a href="/">InventoryPro</a>
            </div>

            <div>
                <ul className="hidden md:flex space-x-6 font-normal text-base">
                    <li><Link to="/" className="hover:text-[#5fc551]">Home</Link></li>
                    <li><Link to="/inventory" className="hover:text-[#5fc551]">Inventory</Link></li>
                    <li><Link to="/customers" className="hover:text-[#5fc551]">Customers</Link></li>
                    <li><Link to="/sales" className="hover:text-[#5fc551]">Sales</Link></li>
                    <li><Link to="/reports" className="hover:text-[#5fc551]">Reports</Link></li>
                </ul>
            </div>



            <div className="flex justify-between items-center px-10">
                {user ? <Button className="bg-[#5fc551] hover:bg-[#4a9e41] border-none" onClick={handleLogout}>

                    <span className="block px-4 py-2  font-medium text-white">LogOut </span>
                </Button> : <Button className="bg-[#5fc551] hover:bg-[#4a9e41] border-none">

                    <a href="/signup" className="block px-4 py-2  font-medium text-white">Sign In </a>
                </Button>}



            </div>

        </nav>

    )
}

export default NavBar
