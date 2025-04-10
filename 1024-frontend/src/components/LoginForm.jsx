import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { MailIcon, LockIcon } from './Icons'

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayError, setDisplayError] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };
  
  const handleBlur = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formato del email
    if (!emailRegex.test(email)) {
      setDisplayError("El email no tiene el formato correcto.");
      return;
    }
    // Validar contraseña: 8-16 caracteres, al menos una mayúscula y un dígito
    if (!passwordRegex.test(password)) {
      setDisplayError("La contraseña debe tener entre 8 y 16 caracteres, al menos una mayúscula y un número.");
      return;
    }

    // Si ambas validaciones pasan, limpiar mensaje de error
    setDisplayError("");

    try {
      const loginResponse = await loginUser({ email, password });

      if (loginResponse.token) {
        window.localStorage.setItem('token', loginResponse.token);
        console.log('Usuario logueado: ' + email)
        navigate('/');
      } else {
        setDisplayError("Email o contraseña son incorrectos");
      }
    } catch (err) {
      console.error('Error: Email o contraseña incorrectos', err.message);
      setDisplayError("Hubo un error al intentar iniciar sesión. Intenta de nuevo más tarde.");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Iniciar sesión
        </h1>

        {displayError && (
          <div
            role="alert"
            className="p-3 mb-4 text-sm font-semibold text-red-700 rounded-md"
            aria-live="assertive"
          >
            {displayError}
          </div>
        )}

        <form className="space-y-6 mt-10" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block mb-4 text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <div className={`flex items-center border-2 ${isFocused.email ? 'border-green-500' : 'border-gray-200'}  px-2 rounded-md`}>
              <MailIcon />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                required
                autoComplete="email"
                aria-required="true"
                placeholder="test@test.com"
                className="w-full px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label
                htmlFor="password"
                className="text-sm mb-4 font-medium text-gray-700"
              >
                Contraseña
              </label>
              <Link
                to="/login/remember-password"
                className="text-xs text-green-600 focus:border-green-600 transition-colors"
                aria-label="Recuperar contraseña olvidada"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="relative">
              <div className={`flex items-center border-2 ${isFocused.password ? 'border-green-500' : 'border-gray-200'} px-2 rounded-md`}>
                <LockIcon />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  required
                  aria-required="true"
                  className="w-full px-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                aria-label={showPasswords.current ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPasswords.current ? <AiOutlineEyeInvisible className="text-lg" /> : <AiOutlineEye className="text-lg" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-6 text-white font-semibold bg-green-500 hover:bg-green-700 rounded-lg transition-colors"
          >
            Iniciar Sesión
          </button>

          <div className="pt-2 text-center">
            <Link
              to="/register"
              className="text-sm text-green-600 hover:underline hover:decoration-green-700 transition-colors"
            >
              ¿No tienes una cuenta? Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
