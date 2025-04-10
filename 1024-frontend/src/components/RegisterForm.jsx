import { useState, useEffect } from "react";
import CountryPrefix from "./CountryPrefix";
import { createUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [prefix, setPrefix] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Estado para manejar errores de validación y animación
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [shake, setShake] = useState({
    name: false,
    email: false,
    password: false,
    phone: false,
  });

  // Expresión regular para email (validación básica)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Función para validar la contraseña de forma detallada
  const validatePassword= (password) => {

    if (!password.trim()) {
      return "La contraseña es obligatoria.";
    }
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (password.length > 16) {
      return "La contraseña no debe exceder 16 caracteres.";
    }
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula.";
    }
    if (!/\d/.test(password)) {
      return "La contraseña debe contener al menos un número.";
    }
    return "";
  };

  // Agregar el prefijo al número de teléfono automáticamente
  useEffect(() => {
    if (prefix) {
      setPhone((prevPhone) => prevPhone.replace(prefix, "")); // quitar el prefijo anterior
    }
  }, [prefix]);

  const completePhone = prefix + phone;

  const validateForm = () => {

    const nameError = !name.trim() ? "El nombre es obligatorio." : "";
    const emailError =
      !email.trim() || !emailRegex.test(email)
        ? "El email es obligatorio y debe tener un formato válido."
        : "";
    const passwordError = validatePassword(password);
    const phoneError = !phone.trim() ? "El teléfono es obligatorio." : "";

    const newErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
      phone: phoneError,

    };

    setErrors(newErrors);
    setShake(newErrors);

    // Quitar la animación de shake después de 500ms
    setTimeout(() => {
      setShake({
        name: false,
        email: false,
        password: false,
        phone: false,
      });
    }, 500);

    // Si hay algún error (cadena no vacía) se retorna false
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage("Por favor corrige los campos marcados en rojo.");
      return;
    }

    setErrorMessage("");

    try {
      const newUser = { name, email, password, phone: completePhone };

      const userData = await createUser(newUser); // Enviar a la API
      console.log("Usuario creado:", userData);

      navigate("/register-ok");
    } catch (err) {
      console.error("Error al registrar al usuario", err);
      setErrorMessage(
        "Hubo un problema al registrar al usuario. Intenta de nuevo más tarde."
      );
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen m-12">
      <div className=" bg-gray-100">
        <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {errorMessage}

              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Datos básicos</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className={`block w-full px-4 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${shake.name ? "shake" : ""
                      }`}
                  />
                  {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className={`block w-full px-4 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${shake.email ? "shake" : ""
                      }`}
                  />
                  {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Datos personales</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña:
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className={`block w-full px-4 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${shake.password ? "shake" : ""
                      }`}
                  />
                  {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    Tu contraseña debe tener entre 8 y 16 caracteres, una mayúscula, una minúscula y un número.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      País:
                    </label>
                    <CountryPrefix onChange={(prefix) => setPrefix(prefix)} />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Número de teléfono:
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="123456789"
                      className={`block w-full px-4 py-2 border ${errors.phone ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${shake.phone ? "shake" : ""
                        }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-red-500 text-sm">El teléfono es obligatorio</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <input
                value="Registrarse"
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent cursor-pointer rounded-md shadow-sm text-sm text-white font-semibold bg-green-500 hover:bg-green-700 
                  transition-colors duration-200"
              />
                
          
            </div>
          </form>
        </div>
      </div>

      {/* Estilos para la animación de shake */}
      <style>
        {`
      @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
      }
      .shake {
        animation: shake 0.3s ease-in-out;
      }
    `}
      </style>
    </main>
  );
};

export default RegisterForm;
