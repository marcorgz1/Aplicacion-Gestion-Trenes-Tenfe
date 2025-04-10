const Train = require("../models/Train");

const TrainUseCases = {
  getById: async (id) => {
    return await Train.findById(id);
  },

  check: async (trainId) => {
    const train = await Train.findById(trainId);
    return train? true : false;
  },

  getCitiesOptions: async (from="origin") => {
    console.log("calling getCitiesOptions");
    return await Train.distinct(from);
  }
};


const TrainController = {
  getForRoute: async (req, res) => {
    const { origin, destination, departureDate, arrivalDate } = req.query;
    console.log("Request date:", req.query);
    const filter = {};

    if (origin) filter.origin = new RegExp(origin, "i");
    if (destination) filter.destination = new RegExp(destination, "i");
    if (departureDate) {
      const startDate = new Date(departureDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(departureDate);
      endDate.setHours(23, 59, 59, 999);

      filter.departureDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (arrivalDate) {
      const startDate = new Date(arrivalDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(arrivalDate);
      endDate.setHours(23, 59, 59, 999);

      const arrivalFilter = {
        origin: filter.destination,
        destination: filter.origin,
        departureDate: {
          $gte: startDate,
          $lte: endDate,
        },
      };

      try {
        const availableDepartureTrains = await Train.find(filter);
        const availableArrivalTrains = await Train.find(arrivalFilter);

        console.log('Available departure trains:', availableDepartureTrains);
        console.log('Available arrival trains:', availableArrivalTrains);

        res.status(200).json({
          departureTrains: availableDepartureTrains,
          arrivalTrains: availableArrivalTrains
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else {
      try {
        const availableTrainsForRouteAndDates = await Train.find(filter);
        console.log("Trenes disponibles:", availableTrainsForRouteAndDates);
        res.status(200).json(availableTrainsForRouteAndDates);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  },

  getById: async (req, res) => {
    try {
      const train = await TrainUseCases.getById(req.params.id);
      res.status(200).json(train);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getOrigins: async (req, res) => {
    try {
      console.log("iniciando getCitiesOptions");
      const origins = await TrainUseCases.getCitiesOptions("origin");
      console.log("Ciudades origen", origins);
      res.status(200).json(origins);
    } catch (error) {
      console.error('Error al obtener las ciudades de origen', error);
      res.status(500).json({ message: error.message });
    }
  },

  getDestinations: async (req, res) => {
    try {
      const destinations = await TrainUseCases.getCitiesOptions("destination");
      res.status(200).json(destinations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = { TrainController, TrainUseCases };
