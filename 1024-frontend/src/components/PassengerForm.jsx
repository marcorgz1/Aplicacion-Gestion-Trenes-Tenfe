import { useState, useContext } from 'react'
import { usePurchase } from '../context/PurchaseContext'
import { AuthContext } from '../context/AuthContext'
import { jwtDecode } from "jwt-decode";

export function PassengerForm() {
  const context = useContext(AuthContext);
  const { purchaseData, updatePurchaseData } = usePurchase();

  const [filledWithUserData, setFilledWithUserData] = useState(false);

  const [passengers, setPassengers] = useState([
    { id: 1, name: "", lastname: "", dni: "", phone: "", email: "" },
  ]);

  const [message, setMessage] = useState({
    text: "",
    isError: false
  });

  const validateDni = (dni) => {
    const regex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i
    if (!regex.test(dni)) {
      return false;
    }
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numero = parseInt(dni.slice(0, 8), 10);
    const letraEsperada = letras[numero % 23];
    const letraDni = dni.charAt(8);
    return letraDni === letraEsperada;
  };

  const validateEmail = (email) => {
    if (!email.includes('@') || !email.includes('.')) {
      setMessage({
        text: "el Dni que has introducido no es válido.",
        isError: true,
      });
      return false;
    }
    return true;
  };

  const checkTokenExpiration = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Token expirado
        context.logout();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error verificando token:", error);
      return true; // Por seguridad, si hay error consideramos expirado
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkTokenExpiration()) {
      setMessage({
        text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
        isError: true,
      });
      return;
    }

    if (!context.isAuthenticated) {
      setMessage({
        text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
        isError: true,
      });
      return;
    }

    try {
      // Filtrar pasajeros válidos (con todos los campos requeridos)
      const validPassengers = passengers.filter(passenger =>
        passenger.name &&
        passenger.lastname &&
        passenger.dni &&
        passenger.email &&
        validateDni(passenger.dni) &&
        validateEmail(passenger.email)
      );

      console.log("Pasajeros válidos:", validPassengers);

      // Verificar si hay al menos un pasajero válido
      if (validPassengers.length === 0) {
        throw new Error("No hay pasajeros válidos para enviar. Por favor, complete al menos un formulario correctamente.");
      }

      // Verificar userId antes de continuar
      if (!context.user?.id) {
        throw new Error("ID de usuario no disponible");
      }

      // Modificar los nombres de los campos para que coincidan con el backend
      const passengersWithData = validPassengers.map((passenger) => ({
        name: passenger.name,
        lastName: passenger.lastname,
        dni: passenger.dni,
        phone: passenger.phone || "",
        email: passenger.email,
        userId: context.user.id
      }));

      console.log("Datos a enviar:", passengersWithData);

      // Actualizar el contexto con los pasajeros
      updatePurchaseData({
        ...purchaseData,
        passengers: passengersWithData
      });

      setMessage({
        text: `${passengersWithData.length} pasajero(s) agregado(s) exitosamente`,
        isError: false,
      });

      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setMessage({ text: "", isError: false });
        // Opcional: navegar a la siguiente página
        // navigate('/reserve-seat');
      }, 3000);
    } catch (error) {
      console.error("Error al agregar pasajero:", error);

      // Verificar si el error es por token expirado
      if (error.message && (
        error.message.includes("jwt expired") ||
        error.message.includes("token expirado") ||
        error.message.includes("unauthorized")
      )) {
        context.logout(); // Cerrar la sesión actual
        setMessage({
          text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          isError: true,
        });

      } else {
        setMessage({
          text: error.message || "Error al agregar los pasajeros",
          isError: true,
        });
      }
    }
  };

  const addPassenger = () => {
    // Verificar si ya hemos alcanzado el número máximo de pasajeros
    if (passengers.length === purchaseData.passengersNumber) {
      setMessage({
        text: "Has alcanzado el número máximo de pasajeros permitidos",
        isError: true,
      });
      return;
    }

    const currentPassenger = passengers[passengers.length - 1];

    // Validar el pasajero actual antes de permitir agregar uno nuevo
    if (!currentPassenger.name || !currentPassenger.lastname || !currentPassenger.dni || !currentPassenger.email) {
      setMessage({
        text: "Por favor, complete todos los campos requeridos del pasajero actual antes de agregar uno nuevo",
        isError: true,
      });
      return;
    }

    // Validar formato DNI y email
    if (!validateDni(currentPassenger.dni)) {
      setMessage({
        text: "El DNI introducido no es válido.",
        isError: true,
      });
      return;
    }

    if (!validateEmail(currentPassenger.email)) {
      setMessage({
        text: "Email no válido. Debe contener @ y .",
        isError: true,
      });
      return;
    }

    // Si pasa todas las validaciones, agregar nuevo pasajero
    const newPassengers = [
      ...passengers,
      {
        id: passengers.length + 1,
        name: "",
        lastname: "",
        dni: "",
        phone: "",
        email: "",
      },
    ];

    setPassengers(newPassengers);

    // No actualizamos el contexto aquí, solo el estado local

    // Mensaje de éxito
    setMessage({
      text: "Pasajero agregado correctamente",
      isError: false,
    });

    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      setMessage({
        text: "",
        isError: false,
      });
    }, 3000);
  };

  const handleChange = (index, field, value) => {

    const newPassengers = [...passengers];
    newPassengers[index][field] = value;

    setPassengers(newPassengers);

    // No actualizamos el contexto aquí, solo el estado local
  };

  const handleDeletePassenger = (index) => {
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);

    // No actualizamos el contexto aquí, solo el estado local

    setMessage({
      text: "Pasajero eliminado correctamente",
      isError: false,
    });

    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      setMessage({
        text: "",
        isError: false,
      });
    }, 3000);
  };

  const fillWithUserData = () => {
    if (context.user) {
      const updatedPassengers = [...passengers];
      updatedPassengers[0] = {
        ...updatedPassengers[0],
        name: context.user.name || "",
        lastname: context.user.lastname || "",
        email: context.user.email || "",
      };
      setPassengers(updatedPassengers);
      setFilledWithUserData(true);

      // Actualizar el contexto de compra con los datos del usuario
      updatePurchaseData({
        ...purchaseData,
        passengers: updatedPassengers
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="relative">

        {!context.isAuthenticated && (
          <div className="text-center">
            <span
              className="text-xl text-green-600 hover:text-green-800 cursor-pointer"
            >
              Por favor, inicia sesión para agregar pasajeros
            </span>
          </div>
        )}
      </div>


      {context.isAuthenticated && (
        <div className="relative z-10 container mx-auto py-10 px-4">
          <h2 className="text-4xl font-bold text-center mb-8">
            Formulario de Pasajeros
          </h2>

          <form onSubmit={handleSubmit}>

            {passengers.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Pasajeros completados</h3>
                <div className="flex flex-col gap-4 w-full">
                  {passengers.map((passenger, idx) => (
                    <div
                      key={passenger.id}
                      className="bg-green-100/30 shadow rounded-lg p-6"
                    >
                      <div className="grid grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nombre</label>
                          <input
                            type="text"
                            placeholder="Nombre"
                            value={passenger.name}
                            onChange={(e) => handleChange(idx, "name", e.target.value)}

                            className='w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-green-500'
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Apellido</label>
                          <input
                            type="text"
                            placeholder="Apellido"
                            value={passenger.lastname}
                            onChange={(e) => handleChange(idx, "lastname", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">DNI</label>
                          <input
                            type="text"
                            placeholder="DNI"
                            value={passenger.dni}
                            onChange={(e) => handleChange(idx, "dni", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#3a9956]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                          <input
                            type="text"
                            placeholder="Teléfono"
                            value={passenger.phone}
                            onChange={(e) => handleChange(idx, "phone", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#3a9956]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                          <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={passenger.email}
                            onChange={(e) => handleChange(idx, "email", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#3a9956]"
                          />
                        </div>
                      </div>
                      {/* Botón de eliminar centrado */}
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => handleDeletePassenger(idx)}
                          className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formulario actual centrado */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-center mb-4">Nuevo Pasajero</h3>
              {context.isAuthenticated && !filledWithUserData && (
                <div className="flex justify-center mb-4">
                  <button
                    onClick={fillWithUserData}
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors"
                  >
                    Rellenar con mis datos
                  </button>
                </div>
              )}
              <div className="flex justify-center">
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre</label>
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={passengers[passengers.length - 1].name}
                        onChange={(e) =>
                          handleChange(passengers.length - 1, "name", e.target.value)
                        }

                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Apellido</label>
                      <input
                        type="text"
                        placeholder="Apellido"
                        value={passengers[passengers.length - 1].lastname}
                        onChange={(e) =>
                          handleChange(passengers.length - 1, "lastname", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">DNI</label>
                      <input
                        type="text"
                        placeholder="DNI"
                        value={passengers[passengers.length - 1].dni}
                        onChange={(e) =>
                          handleChange(passengers.length - 1, "dni", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                      <input
                        type="text"
                        placeholder="Teléfono"
                        value={passengers[passengers.length - 1].phone}
                        onChange={(e) =>
                          handleChange(passengers.length - 1, "phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                      <input
                        type="email"
                        placeholder="Correo Electrónico"
                        value={passengers[passengers.length - 1].email}
                        onChange={(e) =>
                          handleChange(passengers.length - 1, "email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>
                  {/* Botones de acción */}
                  <div className="flex justify-center mt-6 space-x-4">
                    <button
                      type="button"
                      onClick={addPassenger}
                      className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg 
                          shadow-md transition duration-300 ease-in-out transform hover:scale-105 
                          hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-[#3a9956] 
                          focus:ring-opacity-50 disabled:opacity-50"
                      disabled={passengers.length === purchaseData.passengersNumber}
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Agregar Pasajero
                      </span>
                    </button>

                    <button
                      type="submit"
                      className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg 
                          shadow-md transition duration-300 ease-in-out transform hover:scale-105 
                          hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 
                          focus:ring-opacity-50"
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Confirmar Pasajeros
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </form>
          {message.text && (
            <h2 className={`text-center text-xl font-semibold mt-4 ${message.isError ? 'text-red-600' : 'text-green-600'
              }`}>
              {message.text}
            </h2>
          )}

          {passengers.length === purchaseData.passengersNumber && (
            <p className="text-center text-sm text-green-600 mt-4">
              Has alcanzado el número máximo de {purchaseData.passengersNumber} pasajero(s)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
