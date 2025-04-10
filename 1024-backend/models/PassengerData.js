const mongoose = require("mongoose");
const Schema = mongoose.Schema

const PassengerDataSchema = new Schema ({
  name: {
    type: String ,
    required: true,
  },
  
  dni: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return /^[0-9]{8}[A-Z]$/.test(value);
      }
    },
    message: "DNI no válido. Debe contener 8 dígitos numéricos y una letra."
  },
  
  phone: {
    type: String,
  },
  
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return [...value].includes("@") && [...value].includes(".");
      }
    },
    message: "Email no valido. Intentalo de nuevo"
  },
      
  lastName: {
      type: String,
      required: true,
  }
})

module.exports = mongoose.model("PassengerData", PassengerDataSchema);