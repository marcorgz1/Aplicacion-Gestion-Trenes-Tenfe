import { useState } from "react";
import { Link } from "react-router-dom";

import { Header } from "../components/Header";
import { requestPasswordReset } from "../services/api";
import LeftArrowIcon from "../assets/LeftArrow.svg";

function RememberPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 
    try {
      setLoading(true);
      const response = await requestPasswordReset(email);

      if (response?.success) {
        setLoading(false);
        setShowMessage(true); 
      } else {
        setLoading(false);
        setErrorMessage(response?.message || "❌ No se pudo generar el enlace de recuperación."); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error("Error cuando se solicitó el reset:", error);
      setLoading(false);
      setErrorMessage("❌ Error al solicitar el cambio de contraseña. Inténtalo de nuevo."); // Mostrar mensaje de error
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <Header /> 
      
      <div className="flex justify-center items-center">
        <section className="w-[80%] bg-white shadow-lg rounded-lg p-8">
          <button className="flex items-center gap-2 bg-red-600 p-2 rounded hover:bg-red-700 transition-all mb-4">
            <img src={LeftArrowIcon} alt="Left arrow icon" />
            <Link to="/login" className="text-white font-semibold">
              Volver
            </Link>
          </button>

          {showMessage ? (
            <div className="text-center">
              <h1 className="text-4xl text-black mb-6">Revisa la bandeja de correo</h1>
              <p className="text-lg text-gray-700">
                Te hemos enviado un correo con un enlace para restablecer tu contraseña.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-4xl text-black text-center mb-6">
                Recordar mi contraseña
              </h1>

              <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
                <input
                  className="border-[1px] border-gray-400 p-2 w-full max-w-md rounded-md"
                  placeholder="Introduce tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errorMessage && (
                  <p className="text-red-600 text-sm mt-2 text-center">{errorMessage}</p>
                )}
                <button
                  className="w-full max-w-md text-white p-2 font-semibold bg-[#3a9956] rounded hover:bg-green-700 transition-all"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar"}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default RememberPassword;