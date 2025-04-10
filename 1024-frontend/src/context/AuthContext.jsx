import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Importa jwtDecode para decodificar el token

export const AuthContext = createContext(null);

// export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Función para decodificar el token y obtener los datos del usuario
  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token); // Decodifica el token
      return {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        phone: decoded.phone,
        role: decoded.role,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Añade esta función para verificar si un token está expirado
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error al verificar expiración del token:", error);
      return true; // Si hay un error, consideramos que el token está expirado
    }
  };

  // Modifica el useEffect para verificar la expiración del token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verificar si el token ha expirado
      if (isTokenExpired(token)) {
        console.log("Token expirado, cerrando sesión");
        logout(); // Cierra la sesión si el token expiró
      } else {
        const userData = decodeToken(token);
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem("token");
        }
      }
    }
  }, []);

  // Modifica la función login para que acepte email y password
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();
      
      if (data.token) {
        const userData = decodeToken(data.token);
        if (userData) {
          setUser(userData);
          localStorage.setItem("token", data.token);
          return data; // Devuelve la respuesta completa que incluye el token
        }
      }
      
      throw new Error("No se pudo procesar la respuesta del servidor");
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      throw error;
    }
  };

  // Función para manejar el logout
  const logout = () => {
    setUser(null); // Elimina los datos del usuario
    localStorage.removeItem("token"); // Elimina el token del localStorage
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user, // `isAuthenticated` será true si el usuario está logueado
        login,
        logout,
        isTokenExpired, // Exporta la función para que los componentes puedan verificar
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
