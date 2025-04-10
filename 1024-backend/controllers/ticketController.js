const uid = require("uid");

const Ticket = require("../models/Ticket");
const { PassengerUseCases } = require("./passengerController");
const { TrainUseCases } = require("./trainController");
const { UsersUseCases } = require("./userController");


const TicketController = {
  getForUser: async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      res.status(404).send("Usuario no encontrado");
    }
    const userTicketsList = await TicketUseCases.getById( userId )
    res.status(200).json({
      userTicketsList,
    });
  },

  getById: async (req, res) => {
    try {
      const result = await TicketUseCases.getById( req.params.id )
      res.status(200).json({
        message: "Ticket found",
        ticket: result,
      });
    } catch (error) {
      res.status(404).json({
        message: "Ticket not found",
      });
    }
  },
  
  add: async (req, res) => {
    try {
      const userId = req.decodedToken.id;
      const { trainId, passengers, seats } = req.body;
      const result = await TicketUseCases.add(trainId, userId, passengers, seats);
      if (result) {
        res.status(201).json({
        message: "Ticket created",
        ticket: result,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Ticket not created",
        error: error.message,
      });
    }
  },
};

const TicketUseCases = {
  add: async (trainId, userId, passengers, seats) => {
    console.log("add called")
    if (!TicketUseCases.validateTicket(trainId, userId, passengers, seats)) {
      return false;
    }
    console.log("validation correct")
    const passengerIDs = [];
    for (let passenger of passengers) {
      console.log("reading passenger:", passenger)
      try {
        const passengerExists = await PassengerUseCases.check(passenger.dni);
        if (!passengerExists) {
          await PassengerUseCases.addData(passenger)
          console.log("passenger created")
        }
        const passengerData = await PassengerUseCases.getByDni(passenger.dni);
        passengerIDs.push(passengerData._id);
      } catch (error) {
        console.error(`Error procesando pasajero con DNI ${passenger.dni}:`, error.message);
        throw new Error(`Error al procesar el pasajero con DNI ${passenger.dni}: ${error.message}`);
      }
    }
    console.log("passenger ids getted")
    
    const newTicket = new Ticket({
      train: trainId,
      user: userId,
      passengers: passengerIDs,
      seats: seats,
      locator: uid.uid(),
    });
    return await newTicket.save();
  },

  getById: async (id) => {
    return await Ticket.findById( id )
  },

  validateTicket: async (trainId, userId, passengers, seats) => {
    const trainExists = await TrainUseCases.check(trainId);
    const userExists = await UsersUseCases.check(userId);
    const lenghtMatch = passengers.length === seats.length;
    return trainExists && userExists && lenghtMatch;
  }
}

module.exports = {TicketController, TicketUseCases};
