// PurchaseContext.jsx
import  { createContext, useContext, useState, useEffect } from 'react';

const PurchaseContext = createContext();

export const usePurchase = () => useContext(PurchaseContext);

export const PurchaseProvider = ({ children }) => {
  const initialPurchaseData = {
    origin: '',
    destination: '',
    departureDate: '',
    arrivalDate: '',
    trainId: '' ,
    passengersNumber: 1,
    passengers: [ ] ,
    selectedSeats: [34],
    paymentMethod: '',
  };

  const [purchaseData, setPurchaseData] = useState(initialPurchaseData);
  const [currentStep, setCurrentStep] = useState(0);

  // Función para actualizar los datos de la compra
  const updatePurchaseData = (newData) => {
    setPurchaseData(prevData => ({ ...prevData, ...newData }));
  };

  // Función para limpiar los datos de la compra y volver al estado inicial
  const clearPurchaseData = () => {
    setPurchaseData(initialPurchaseData);
  };

  // Función para validar si el usuario puede estar en el paso actual
  const validateStep = (step) => {
    switch (step) {
      case 0: // Paso 1: Seleccionar viaje
        return true;
      case 1: // Paso 2: Introducir datos
        return purchaseData.origin && purchaseData.destination && purchaseData.date;
      case 2: // Paso 3: Personalizar viaje
        return purchaseData.passengers > 0;
      case 3: // Paso 4: Pago
        return purchaseData.selectedSeats.length > 0;
      case 4: // Paso 5: Confirmación
        return true;
      default:
        return false;
    }
  };

  // Redirige al usuario al paso 1 si no se cumplen los requisitos
  useEffect(() => {
    if (!validateStep(currentStep)) {
      setCurrentStep(0);
    }
  }, [currentStep]);

  // Función para avanzar al siguiente paso
  const goToNextStep = () => {
    if (validateStep(currentStep + 1)) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  // Función para retroceder al paso anterior
  const goToPreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <PurchaseContext.Provider
      value={{
        purchaseData,
        updatePurchaseData,
        clearPurchaseData,
        currentStep,
        setCurrentStep,
        goToNextStep,
        goToPreviousStep,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};
