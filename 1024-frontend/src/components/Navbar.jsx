import { Link } from 'react-router-dom'
import { UserCircleIcon } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import { useState, useEffect } from 'react'
import { DropdownMenu } from './DropdownMenu'

export function Navbar() {
  const [userAuthenticated, setUserAuthenticated] = useState(false)
  const [userName, setUserName] = useState('')
  const [isdDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const userToken = window.localStorage.getItem('token')

    if (userToken) {
      try {
        const decodedInfoUser = jwtDecode(userToken)

        const { name } = decodedInfoUser
        setUserName(name)

        setUserAuthenticated(true)
      } catch (err) {
        console.error('Error al decodificar el token:', err)
      }
    }
  }, [])

  const toggleDropdown = (e) => {
    e.stopPropagation()
    setIsDropdownOpen(!isdDropdownOpen)
  }

  const handleClickOutside = () => {
    if (isdDropdownOpen) {
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isdDropdownOpen])

  const handleLogout = () => {
    window.localStorage.removeItem('token')

    setUserAuthenticated(false)
  }

  return (
    userAuthenticated ? (
      <nav className="flex items-center gap-12 ">
        <div className='flex items-center gap-4'>
          <Link 
            to="/my-trips"
            className='font-semibold p-2 rounded hover:bg-[#3a9956] transition-all'>
              Mis viajes
          </Link>
          <Link 
          to="/blog"
          className='font-semibold p-2 rounded hover:bg-[#3a9956] transition-all'>
          Blog
          </Link>
          <Link 
            to="/help"
            className='font-semibold p-2 rounded hover:bg-[#3a9956] transition-all'>
              Ayuda
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={toggleDropdown}>
            <UserCircleIcon className='size-8 cursor-pointer hover:text-green-400' />
          </button>
          <span className="text-white font-semibold">{userName}</span>
        </div>

        {/* Dropdown Menu */}
        {
          isdDropdownOpen && (
            <DropdownMenu handleLogout={handleLogout} />
          )}
      </nav>

    ) : (
      <nav className="flex items-center gap-16 text-white">
        <div className='flex items-center gap-4'>
          <Link 
          to="/blog"
          className='font-semibold p-2 rounded hover:bg-[#3a9956] transition-all'>Blog</Link>
          <Link
            to="/help"
            className='font-semibold p-2 rounded hover:bg-[#3a9956] transition-all'>
              Ayuda
          </Link>
        </div>

        <div id='buttons-wrapper' className='flex items-center gap-6'>
          <Link to="/register" className='text-white font-semibold bg-gray-500 hover:bg-gray-700 transition-colors p-2 rounded'>
            Registrarse
          </Link>
          <Link to="/login" className='font-semibold bg-[#3a9956] p-2 rounded hover:bg-green-700 transition-colors'>
            Iniciar sesión
          </Link>
        </div>
      </nav>
    )
  )
}
