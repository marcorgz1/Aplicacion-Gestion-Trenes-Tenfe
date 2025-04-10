import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function HelpForm () {
  const [formData, setFormData] = useState({ email: "", description: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/help/new_help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
        });

      // Si la respuesta no es exitosa, lanzar un error con más detalles
      if (!response.ok) {
        const errorData = await response.json(); // Obtener detalles del error del backend
        throw new Error(errorData.message || "Error al enviar la solicitud.");
      }

      setSubmitted(true);
      setError("");

      setTimeout(() => {
        navigate("/");
      }, 4000);

    } catch (err) {
      console.error("Error al enviar la solicitud:", err);
      setError("Hubo un error al enviar la solicitud. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-24 min-h-screen p-4">
      <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl text-center font-semibold mb-10">Formulario de Ayuda</h1>
        <p className="text-gray-400 text-sm text-center mb-8">Por favor, rellene el siguiente formulario para cualquier asunto que necesite.</p>
      {
      submitted ? (
        <p className="text-green-600 text-center font-semibold">Se ha recibido la solicitud. En breves te responderemos.
        Redirigiendo al Home ...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="flex flex-col gap-4">
            <label className="block text-gray-700 font-medium">Correo:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-400 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="block text-gray-700 font-medium">Descripción del problema:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-3000 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none"
            />
          </div>
          {error && ( 
              <p className="text-red-600 text-center font-semibold">{error}</p>
            )}
          <button
            type="submit"
            className="font-semibold w-full bg-green-500 rounded-md text-white py-2 hover:bg-green-700 transition-colors"
          >
            Enviar
          </button>
        </form>
      )}
      </div>      
    </div>
  );
}
