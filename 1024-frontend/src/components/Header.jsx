import { Link } from "react-router-dom"
import { Navbar } from "./Navbar"
import TenfeLogo from '../assets/LogoTenfe.svg'

export function Header () {
    return (
        <main className="text-white flex justify-between items-center px-6 py-6 bg-gray-800 relative z-50">
            <Link to="/">
                <img src={TenfeLogo} alt='Logo' className="h-10 w-auto" />
            </Link>
            <Navbar />
        </main>
    )
}
