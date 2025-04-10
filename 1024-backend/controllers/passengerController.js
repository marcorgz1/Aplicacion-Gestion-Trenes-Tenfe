const PassengerData = require("../models/PassengerData")

const PassengerController = {
  addData: async (req, res) => {
    try {
      const data = req.body;
      const passengers = await Promise.all(
        PassengerUseCases.addMultipleData(data)
      );
      res.status(201).json({
        message: "Passenger added successfully",
        passengers: passengers
      });
    } catch (err) {
      console.log("Error trying to add passengers:", err);
      res.status(500).json({
        message: err.message
      });
    }
  },

  getData: async (req, res) => {
    try {
      const passengers = await PassengerData.find();
      res.status(200).json( passengers );
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  getDataById: async (req, res) => {
    try {
      const passengerData = await PassengerUseCases.getById( req.params.id )
      res.status(200).json({ data: passengerData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getByDNI: async (req, res) => {
    try {
      const passenger = await PassengerUseCases.getByDni(req.params.dni)
      res.status(200).json( passenger );
    } catch (error) {
      res.status(500).json({ error: "Passenger does not exists" });
    }
  }
};

const PassengerUseCases = {
  check: async (passengerDNI) => {
    const passenger = await PassengerData.find({ dni: passengerDNI });
    return passenger.length !== 0
  },

  getById: async (id) => {
    return await PassengerData.findById(id);
  },

  getByDni: async (dni) => {
    const result = await PassengerData.find({ dni: dni })
    if (result.length === 0) {
      throw new Error(`No passenger found with DNI: ${dni}`);
    }
    return result[0]
  },

  addData: async (passengerData) => {
    const { name, lastName, dni, email, phone } = passengerData;
    const newPassenger = new PassengerData({ name, lastName, dni, email, phone });
    return await newPassenger.save();
  },

  addMultipleData: async (passengers) => {
    const result = []
    for (let passengerData of passengers) {
      result.push( await PassengerUseCases.addData(passengerData) )
    }
    return result
  }
}

module.exports = {PassengerController, PassengerUseCases}
