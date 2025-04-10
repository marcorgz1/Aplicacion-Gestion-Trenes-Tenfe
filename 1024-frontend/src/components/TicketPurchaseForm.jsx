import { useState } from "react";
import { addTicketData } from "../services/api";
import { Wallet } from 'lucide-react';
import { usePurchase } from '../context/PurchaseContext';
import { useNavigate } from 'react-router-dom';

export function TicketPurchaseForm() {
  const navigate = useNavigate();
  const { purchaseData, updatePurchaseData } = usePurchase();
  
  const [cardNumber, setCardNumber] = useState("");
  const [internetCode, setInternetCode] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Regex para validar el número de tarjeta:
  // - Visa: 16 dígitos, empieza por 4
  // - Mastercard: 16 dígitos, empieza por 51-55
  // - American Express: 15 dígitos, empieza por 34 o 37
  const cardNumberRegex = /^(?:4\d{15}|5[1-5]\d{14}|3[47]\d{13})$/;

  // Regex para validar fecha de vencimiento en formato MM/AA (mes de 01 a 12)
  const expiryDateRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;

  // CVV
  const internetCodeRegex = /^\d{3,4}$/;

  // Agrega espacios cada 4 dígitos
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleInternetCodeChange = (e) => {
    // Solo permitir dígitos numéricos
    const value = e.target.value.replace(/\D/g, '');
    // Limitar a 4 dígitos
    const trimmedValue = value.slice(0, 4);
    setInternetCode(trimmedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawCardNumber = cardNumber.replace(/\s/g, "");
    const today = new Date();

    if (!cardNumberRegex.test(rawCardNumber)) {
      setErrorMessage(
        "El número de tarjeta no es válido. Asegúrate de usar un formato correcto (Visa, Mastercard o American Express)."
      );
      setSuccessMessage("");
      return;
    }

    if (!expiryDateRegex.test(expiryDate)) {
      setErrorMessage(
        "La fecha de vencimiento debe tener el formato MM/AA (mes entre 01 y 12)."
      );
      setSuccessMessage("");
      return;
    }

    if (internetCode.length < 3 || internetCode.length > 4 || !/^\d+$/.test(internetCode)) {
      setErrorMessage(
        "El código de seguridad debe tener 3 o 4 dígitos numéricos."
      );
      setSuccessMessage("");
      return;
    }

    const [expMonth, expYear] = expiryDate.split("/").map(Number);
    const fullExpYear = 2000 + expYear;
    const expirationDate = new Date(fullExpYear, expMonth, 0);

    if (expirationDate < today) {
      setErrorMessage("La tarjeta ha expirado.");
      setSuccessMessage("");
      return;
    }

    const paymentInfo = {
      cardNumber: rawCardNumber, //Eliminar espacios para enviar al backend
      internetCode,
      expiryDate
    };

    // Actualizar el contexto con la información de pago
    updatePurchaseData({
      ...purchaseData,
      paymentInfo
    });

    try {
      // Verificar que tenemos los datos requeridos
      if (!purchaseData.trainId) {
        setErrorMessage("Falta el ID del tren. Por favor, vuelve a la selección de viaje.");
        return;
      }

      if (!purchaseData.passengers || purchaseData.passengers.length === 0) {
        setErrorMessage("No hay pasajeros registrados. Por favor, añade los datos de los pasajeros.");
        return;
      }

      if (!purchaseData.selectedSeats || purchaseData.selectedSeats.length === 0) {
        setErrorMessage("No hay asientos seleccionados. Por favor, selecciona tus asientos.");
        return;
      }

      // Verificar que tenemos el mismo número de pasajeros que asientos
      if (purchaseData.passengers.length !== purchaseData.selectedSeats.length) {
        setErrorMessage("El número de pasajeros debe coincidir con el número de asientos seleccionados.");
        console.error("Discrepancia en número de pasajeros y asientos:", {
          pasajeros: purchaseData.passengers.length,
          asientos: purchaseData.selectedSeats.length
        });
        return;
      }

      // Verificar la estructura de los datos de pasajeros
      const passengerMissingFields = purchaseData.passengers.some(p => 
        !p.name || !p.lastName || !p.dni || !p.email
      );
      
      if (passengerMissingFields) {
        setErrorMessage("Algunos pasajeros tienen datos incompletos. Por favor, verifica la información.");
        console.error("Datos de pasajeros incompletos:", purchaseData.passengers);
        return;
      }

      // Si hay algún pasajero con lastname en lugar de lastName, corregir la estructura
      const correctedPassengers = purchaseData.passengers.map(p => {
        // Si tiene lastname pero no lastName, corregir
        if (p.lastname && !p.lastName) {
          return {
            ...p,
            lastName: p.lastname,
            lastname: undefined // eliminar la propiedad incorrecta
          };
        }
        return p;
      });

      // Estructura correcta que espera el backend
      const ticketData = {
        trainId: purchaseData.trainId,
        passengers: correctedPassengers,
        seats: purchaseData.selectedSeats
      };

      console.log("Datos a enviar al backend (estructura completa):", JSON.stringify(ticketData, null, 2));
      console.log("Verificando datos críticos:");
      console.log("- trainId:", ticketData.trainId);
      console.log("- passengers:", ticketData.passengers.length, "elementos");
      console.log("- seats:", ticketData.seats.length, "elementos");
      console.log("- Primer pasajero:", JSON.stringify(ticketData.passengers[0], null, 2));

      // Enviar datos al backend
      const response = await addTicketData(ticketData);

      console.log("Respuesta del servidor:", response);

      setCardNumber("");
      setInternetCode("");
      setExpiryDate("");
      setSuccessMessage("Pago procesado con éxito");

      // Navegar a la confirmación después de 2 segundos
      setTimeout(() => {
        navigate('/buy-confirmation');
      }, 2000);

    } catch (error) {
      console.error("Error completo:", error);
      setErrorMessage(
        "Error al procesar el pago. Por favor, intenta de nuevo. " +
        (error.message || "")
      );
      setSuccessMessage("");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative z-10 flex justify-center items-start min-h-screen mt-[5%] p-4">
        <div className="max-w-md w-full p-6 rounded-xl shadow-lg bg-white">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Compra de Billete</h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 rounded-lg bg-white"
          >
            <div className="space-y-2">
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Número de Tarjeta
              </label>
              <input
                id="cardNumber"
                type="text"
                placeholder="4871 3027 9815 2716"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                maxLength="19"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="internetCode" className="block text-sm font-medium text-gray-700">
                Código de Seguridad (3-4 dígitos)
              </label>
              <input
                id="internetCode"
                type="password"
                placeholder="680"
                value={internetCode}
                onChange={handleInternetCodeChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                maxLength="4"
              />
              <p className="text-xs text-gray-500">
                Ingresa los 3 o 4 dígitos que aparecen en el reverso de tu tarjeta
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Fecha de Vencimiento
              </label>
              <input
                id="expiryDate"
                type="text"
                placeholder="05/28"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                maxLength="5"
                aria-label="Introducir fecha de vencimiento"
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm p-2 bg-red-50 rounded-lg" role="alert">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="text-[#3a9956] text-sm p-2 bg-green-50 rounded-lg" role="alert">
                {successMessage}
              </p>
            )}

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="flex items-center gap-4 w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-[#3a9956] focus:ring-offset-2 transition duration-300 ease-in-out hover:scale-105"
                aria-label="Confirmar compra de billete"
              >
                <Wallet className="h-6 w-6" />
                Comprar Billete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
