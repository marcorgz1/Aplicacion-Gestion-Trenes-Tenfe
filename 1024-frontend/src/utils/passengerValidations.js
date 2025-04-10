const passengerValidations = {
  validatePassengersNumber: (passengerNumber) => {
    if (passengerNumber < 1 || passengerNumber > 5) {
      return {
        validationResult: false,
        message: "Error: Tiene que viajar al menos un pasajero",
      };
    }
    return {
      validationResult: true,
      message: "",
    };
  },
};

export default passengerValidations;
