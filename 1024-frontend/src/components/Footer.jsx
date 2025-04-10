import { Link } from 'react-router-dom'
import { FacebookIcon, XIcon, InstagramIcon } from '../components/Icons';

export function Footer() {
    const FooterSection = ({ title, children }) => (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
            {children}
        </div>
    )

    return (
        <footer className="bg-slate-900 text-white">
            {/* Contenido principal del footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid justify-center items-center grid-cols-3 gap-8">
                    {/* Términos y Privacidad */}
                    <FooterSection title="Términos y Privacidad">
                        <ul className="space-y-2 text-slate-300">
                            <li>
                                <Link to="#" className="hover:text-green-500 transition">Términos de servicio</Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-green-500 transition">Política de Privacidad</Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-green-500 transition">Cookies</Link>
                            </li>
                        </ul>
                    </FooterSection>

                    {/* Enlaces rápidos */}
                    <FooterSection title="General">
                        <ul className="space-y-2 text-slate-300">
                            <li>
                                <Link to="/my-trips" className="hover:text-green-500 transition">Mis viajes</Link>
                            </li>
                            <li>
                                <Link to="/blog" className="hover:text-green-500 transition">Blog</Link>
                            </li>
                        </ul>
                    </FooterSection>

                    {/* Redes sociales */}
                    <FooterSection title="Síguenos">
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-green-500 transition">
                                <FacebookIcon />
                            </a>
                            <a href="#" className="hover:text-green-500 transition">
                                <XIcon />
                            </a>
                            <a href="#" className="hover:text-green-500 transition">
                                <InstagramIcon />
                            </a>
                        </div>
                    </FooterSection>
                </div>
            </div>

            {/* Barra inferior */}
            <div className="border-t border-green-700 py-6 text-center text-slate-400">
                <p>&copy; {new Date().getFullYear()} Tenfe. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}
