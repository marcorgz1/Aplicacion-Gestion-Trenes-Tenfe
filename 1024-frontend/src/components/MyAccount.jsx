import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Edit } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LockIcon } from '../components/Icons'

export function MyAccount() {
    // Estado para guardar la información contenida en el token
    const [userData, setUserData] = useState({})
    const [error, setError] = useState(null)

    // Estados para manejar edición de campos del formulario
    const [isEditingName, setIsEditingName] = useState(false)
    const [isEditingEmail, setIsEditingEmail] = useState(false)
    const [isEditingPhone, setIsEditingPhone] = useState(false)

    const [isFocused, setIsFocused] = useState({
        name: false,
        email: false,
        phone: false
    });

    useEffect(() => {
        // Si existe el token
        // Obtener token del localStorage
        const token = localStorage.getItem('token')

        if (token) {
            try {
                // Intentar decodificarlo para obtener la info del usuario
                const decodedInfoUser = jwtDecode(token)

                console.log(decodedInfoUser)

                const { id, name, email, phone } = decodedInfoUser

                // Guardar info extraída en el estado "userData"
                setUserData({ id, name, email, phone })

            } catch (err) {
                console.error('Error al decodificar el token:', err)
                setError('Error al decodificar el token.')
            }
        }

        if (!token) {
            console.error('Error: No hay ningún token almacenado')
        }

    }, [])

    const handleEdit = (field) => {
        if (field === 'name') {
            setIsEditingName(true)
        }

        if (field === 'email') {
            setIsEditingEmail(true)
        }

        if (field === 'phone') {
            setIsEditingPhone(true)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target

        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }))

    }

    const handleFocus = (field) => {
        setIsFocused((prev) => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field) => {
        setIsFocused((prev) => ({ ...prev, [field]: false }));
    };

    const handleSave = async (field) => {
        try {
            if (field === 'name') {
                setIsEditingName(false)
            }

            if (field === 'email') {
                setIsEditingEmail(false)
            }

            if (field === 'phone') {
                setIsEditingPhone(false)
            }

            localStorage.setItem('userData', JSON.stringify(userData))

            const userId = userData.id

            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(userData)
            })

            return response.json()
        } catch (err) {
            console.error('Error al guardar la información actualizada del usuario:', err)
        }
    }

    useEffect(() => {
        const updatedUserData = localStorage.getItem('userData')

        if (updatedUserData) {
            setUserData(JSON.parse(updatedUserData))
        }
    }, [])


    const handleCancel = (e, field) => {
        e.preventDefault()

        if (field === 'name') {
            setIsEditingName(false)
        }
        if (field === 'email') {
            setIsEditingEmail(false)
        }
        if (field === 'phone') {
            setIsEditingPhone(false)
        }
    }


    return (
        <main className="flex flex-col justify-center items-center min-h-screen text-gray-800 mt-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Mi cuenta</h1>
            <div className="w-full max-w-4xl p-8 mb-16 bg-gray-50 rounded-lg shadow-lg">
                <section className='flex flex-col gap-2 ml-8 mb-6'>
                    <div className='flex items-center gap-4'>
                        {isEditingName ? (
                            <section className="flex items-center gap-4">
                                <input
                                    id="name"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleInputChange}
                                    className={`flex-1 border ${isFocused.name ? 'border-green-500' : 'border-gray-300'} rounded-md px-3 py-2 transition-colors`}
                                    onFocus={() => handleFocus('name')}
                                    onBlur={() => handleBlur('name')}
                                    aria-label="Editar nombre"
                                />
                                <div className="flex gap-2">
                                    <button
                                        className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                        onClick={() => handleSave('name')}
                                        aria-label="Guardar cambios en el nombre"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        onClick={(e) => handleCancel(e, 'name')}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </section>
                        ) : (
                            <section className="flex items-center">
                                <span className="flex-1 border-gray-300 rounded-md px-3 py-2">
                                    {userData.name}
                                </span>
                                <button
                                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                    onClick={() => handleEdit('name')}
                                    aria-label="Editar nombre"
                                >
                                    <Edit className="text-green-500 hover:text-green-700 size-6" />
                                </button>
                            </section>
                        )}
                    </div>
                    <div className='flex items-center gap-4'>
                        {isEditingEmail ? (
                            <section className="flex items-center gap-4">
                                <input
                                    id="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    className={`flex-1 border ${isFocused.email ? 'border-green-500' : 'border-gray-300'} rounded-md px-3 py-2 transition-colors`}
                                    onFocus={() => handleFocus('email')}
                                    onBlur={() => handleBlur('email')}
                                    aria-label="Editar nombre"
                                />
                                <div className="flex gap-2">
                                    <button
                                        className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                        onClick={() => handleSave('email')}
                                        aria-label="Guardar cambios en el email"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        onClick={(e) => handleCancel(e, 'email')}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </section>
                        ) : (
                            <section className="flex items-center">
                                <span className="flex-1 border-gray-300 rounded-md px-3 py-2">
                                    {userData.email}
                                </span>
                                <button
                                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                    onClick={() => handleEdit('email')}
                                    aria-label="Editar email"
                                >
                                    <Edit className="text-green-500 hover:text-green-700 size-6" />
                                </button>
                            </section>
                        )}
                    </div>
                    <div className='flex items-center gap-4'>
                        {isEditingPhone ? (
                            <section className="flex items-center gap-4">
                                <input
                                    id="phone"
                                    name="phone"
                                    value={userData.phone}
                                    onChange={handleInputChange}
                                    className={`flex-1 border ${isFocused.phone ? 'border-green-500' : 'border-gray-300'} rounded-md px-3 py-2 transition-colors`}
                                    onFocus={() => handleFocus('phone')}
                                    onBlur={() => handleBlur('phone')}
                                    aria-label="Editar nombre"
                                />
                                <div className="flex gap-2">
                                    <button
                                        className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                        onClick={() => handleSave('phone')}
                                        aria-label="Guardar cambios en el phone"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        onClick={(e) => handleCancel(e, 'phone')}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </section>
                        ) : (
                            <section className="flex items-center">
                                <span className="flex-1 border-gray-300 rounded-md px-3 py-2">
                                    {userData.phone}
                                </span>
                                <button
                                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                    onClick={() => handleEdit('phone')}
                                    aria-label="Editar phone"
                                >
                                    <Edit className="text-green-500 hover:text-green-700 size-6" />
                                </button>
                            </section>
                        )}
                    </div>
                </section>
                <hr />
                <section className='flex flex-col gap-4 mt-8'>
                    <h2 className='text-xl font-semibold'>Seguridad de la cuenta</h2>
                    <div className='flex items-center justify-between gap-4 bg-gray-100 p-6 rounded mt-4'>
                        <div className='flex items-center gap-2'>
                            <LockIcon />
                            <span>Contraseña</span>
                        </div>
                        <Link
                            className="px-4 py-2 text-sm text-white font-semibold bg-green-500 rounded-md hover:bg-green-700 transition-colors"
                            to="/my-account/change-password"
                        >
                            Cambiar contraseña
                        </Link>
                    </div>
                </section>
                {
                    error && (
                        <span className="block text-red-600 text-lg font-medium mb-6 text-center" role="alert">
                            {error}
                        </span>
                    )
                }
            </div>
        </main>
    );
}
