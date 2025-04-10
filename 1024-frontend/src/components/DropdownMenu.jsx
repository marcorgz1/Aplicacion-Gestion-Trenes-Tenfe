import { Link } from "react-router-dom";

export function DropdownMenu ({ handleLogout }) {
    return (
        <div className="absolute right-20 top-10 w-48 bg-white rounded-md shadow-lg">
            <div className="py-1">
                <Link
                    to="/my-account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    Perfil
                </Link>
                <Link
                    to="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    Configuración
                </Link>
                <Link
                    to="/login"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 transition-all"
                >
                    Cerrar sesión
                </Link>
            </div>
        </div>
    )
}