import { useState } from 'react';
import { Link } from 'react-router-dom';

export function LoginModal({ onLogin, onClose, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      onLogin({ error: "El email no tiene el formato correcto." });
      return;
    }

    if (!passwordRegex.test(password)) {
      onLogin({ error: "La contraseña debe tener entre 8 y 16 caracteres, al menos una mayúscula y un número." });
      return;
    }

    onLogin({ email, password });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Inicia sesión para continuar
        </h1>

        {error && (
          <div className="p-3 mb-4 text-sm font-semibold text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <Link
                to="/login/remember-password"
                className="text-xs text-green-600"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 text-sm"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-white font-semibold bg-green-500 hover:bg-green-700 rounded-lg"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">¿No tienes cuenta? </span>
          <Link
            to="/register"
            className="text-green-600 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            Regístrate
          </Link>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="text-white font-semibold bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
