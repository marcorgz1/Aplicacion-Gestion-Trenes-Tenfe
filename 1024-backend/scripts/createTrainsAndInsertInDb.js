console.log("Creating trains and inserting in db...")
require("dotenv").config();
const mongoose = require('mongoose')
const Train = require('../models/Train')

const cities = [
    "Madrid", "A Coruña", "Barcelona", "Sevilla", "Valencia", "Bilbao",
    "Zaragoza", "Malaga", "Murcia", "Palma", "Vitoria-Gasteiz",
    "Valladolid", "Cordoba", "Santander", "Oviedo", "Pamplona", "Logroño",
    "Badajoz", "Salamanca", "Toledo", "Burgos", "Albacete", "Guadalajara",
    "Huelva", "Jaen", "Lugo", "Orense", "Segovia", "Soria", "Tarragona",
    "Teruel", "Zamora", "Avila", "Caceres", "Ciudad Real", "Cuenca", "Huesca",
]

const buildTrain = (departureDate, arrivalDate) => ({
    origin: cities[Math.floor(Math.random() * 38)],
    destination: cities[Math.floor(Math.random() * 38)],
    departureDate,
    arrivalDate,
    duration: 7200,
    price: (Math.random() * 171 + 30).toFixed(2) * 1
})

const buildListOfTrains = (startDate, numDays = 30) => {
    const trains = [];
    
    for (let i = 0; i < numDays; i++) {
        const currentDate = startDate;
        currentDate.setDate(currentDate.getDate() + i);
        const departureDate = currentDate
        console.log(departureDate)
        const arrivalDate = new Date(currentDate.getTime() + 2 * 60 * 60 + 1000)

        trains.push(buildTrain(departureDate, arrivalDate));
    }
    
    console.log('Inserted trains:', trains)
    
    return trains;
}


const insertTrainsInDb = async (trains) => {
    try {
        const result = await Train.insertMany(trains)
        console.log(`Successfully inserted ${result.length} trains`)
        return result
    } catch (error) {
        console.error('Error inserting trains:', error)
        throw error
    }
}

const deleteAllTrainsFromDb = async () => {
    try {
        await Train.deleteMany()
        console.log("Successfully deleted all trains from db")
    } catch (error) {
        console.error('Error deleting trains:', error)
        throw error
    }
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to BBDD")
    await deleteAllTrainsFromDb()
    const trains = buildListOfTrains(new Date("2025-02-13"), 30)
    console.log('Trains:', trains)
    await insertTrainsInDb(trains)
    console.log("Trains inserted successfully")
    console.log("Exiting...")
    mongoose.disconnect()
    process.exit(0)
  })
  .catch((error) => console.log("Error trying to connect to BBDD:", error));

