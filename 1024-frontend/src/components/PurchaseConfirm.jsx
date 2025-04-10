import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { usePurchase } from "../context/PurchaseContext";
import { useNavigate } from "react-router-dom";
import { getTrips } from "../services/api";
import { DownloadTickets } from "./DownloadTickets";

export function PurchaseConfirm() {
  const context = useContext(AuthContext);
  const { purchaseData, clearPurchaseData } = usePurchase();
  const [showDetails, setShowDetails] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleViewTrips = async () => {
    try {
      setSaving(true);

      // Usar todos los datos disponibles del contexto
      // Incluir todos los datos del purchaseData para mantener la consistencia
      const tripData = {
        ...purchaseData,  // Mantener todos los datos originales
        
        // Asegurar que los campos críticos existan para evitar errores
        schedule: purchaseData.schedule || {
          departure: "No disponible",
          arrival: "No disponible",
          duration: "No disponible",
          price: 0
        },
        
        // Usar los valores existentes o proporcionar valores por defecto solo si es necesario
        passengers: purchaseData.passengers || [],
        selectedSeats: purchaseData.selectedSeats || [],
        
        // Calcular el precio total de forma segura solo si no existe
        totalAmount: purchaseData.totalAmount || 
          ((purchaseData.schedule?.price || 0) * (purchaseData.passengers?.length || 1))
      };

      console.log("Enviando datos completos del viaje:", tripData);

      // Usar getTrips con los datos para guardar el viaje
      const result = await getTrips(tripData);
      console.log("Respuesta del servidor:", result);

      // Limpiar datos y navegar
      if (typeof clearPurchaseData === 'function') {
        clearPurchaseData();
      } else {
        console.warn('La función clearPurchaseData no está disponible. No se limpiaron los datos de compra.');
      }
      
      navigate('/my-trips');
      
    } catch (error) {
      console.error("Error al guardar el viaje:", error);
      alert("Hubo un error al guardar tu viaje. Por favor, intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="z-50 min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-green-600 px-6 py-4">
            <div className="flex justify-center mb-2">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <svg className="h-8 w-8 text-[#3a9956]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Compra Confirmada</h1>
          </div>
          
          <div className="px-6 py-8">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">¡Gracias por tu compra!</p>
              <p className="text-xl font-semibold text-gray-800">{context.user?.name}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Estado:</span>
                <span className="font-medium text-green-600">Confirmado</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Fecha:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            {showDetails && (
              <div className="mt-6 border-t border-gray-200 pt-4 animate-fadeIn">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Detalles del viaje</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Horario</p>
                      <p className="font-medium">
                        {purchaseData.schedule?.departure || "No disponible"} - {purchaseData.schedule?.arrival || "No disponible"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duración</p>
                      <p className="font-medium">{purchaseData.schedule?.duration || "No disponible"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pasajeros</p>
                      <p className="font-medium">{purchaseData.passengers?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Asientos</p>
                      <p className="font-medium">{purchaseData.selectedSeats?.join(', ') || "No seleccionados"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Precio total</p>
                      <p className="font-medium">
                        {purchaseData.schedule?.price 
                          ? `${purchaseData.schedule.price * (purchaseData.passengers?.length || 1)}€`
                          : "No disponible"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Método de pago</p>
                      <p className="font-medium">
                        {purchaseData.paymentInfo?.cardNumber 
                          ? `Tarjeta terminada en ${purchaseData.paymentInfo.cardNumber.slice(-4)}`
                          : "No disponible"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 space-y-4">
              <button 
                className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#3a9956] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3a9956]"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Ocultar detalles" : "Ver detalles"}
              </button>

              {downloading && <DownloadTickets onDownloadComplete={() => setDownloading(false)} />}
      
              <button 
                className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => setDownloading(true)}
                disabled={downloading || saving}
              >
                Descargar mis Tickets
              </button>
              
              
              <button 
                className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
                onClick={handleViewTrips}
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : "Ver mis viajes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
