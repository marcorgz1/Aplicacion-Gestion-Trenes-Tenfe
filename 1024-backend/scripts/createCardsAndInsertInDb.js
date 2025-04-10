console.log("Creating cards and inserting in db...");
const mongoose = require('mongoose')
const path = require('path')
const Card = require('../models/Card')
require("dotenv").config({path:path.resolve(__dirname, '../.env')});

mongoose
    .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to BBDD")
    await deleteAllCardsFromDb()
    const cards = buildListOfCards(10)
    await insertCardsInDb(cards)
    console.log("Cards inserted successfully")
    console.log("Exiting...")
    mongoose.disconnect()
    process.exit(0)
  })
  .catch((error) => console.log("Error trying to connect to BBDD:", error));

const namesList = [
    "Juan Pérez", "Ana Gómez", "Carlos Fernández", "Maria Rodríguez", "José Martínez", 
    "Laura Sánchez", "David López", "Carmen García", "Luis Hernández", "Marta Pérez",
    "Pedro López", "Raquel Díaz", "Miguel Ruiz", "Isabel Sánchez", "Antonio Gómez"
]

const cardNumberRegex = /^(?:4\d{15}|5[1-5]\d{14}|3[47]\d{13})$/;

const generateCardNumber = () => {
    let cardNumber = '';

    do {
        cardNumber = '';
        for (let i = 0; i < 16; i++) {
            cardNumber += Math.floor(Math.random() * 10);
        }
    } while (!cardNumberRegex.test(cardNumber));

    return cardNumber;
};

const generateCVV = () => {
    return Math.floor(Math.random() * 900) + 100;
}

const generateExpirationDate = () => {
    const currentDate = new Date();
    const expirationYear = currentDate.getFullYear() + Math.floor(Math.random() * 5) + 1;
    const expirationMonth = Math.floor(Math.random() * 12) + 1;
    
    return new Date(expirationYear , expirationMonth -1 , 1);
}

const buildCard = () => {
    const cardNumber = generateCardNumber();

    const cardName = namesList[Math.floor(Math.random() * namesList.length)];


    return {
        cardNumber: cardNumber,
        cvv: generateCVV(),
        expirationDate: generateExpirationDate(),
        balance: Math.floor(Math.random() * 10000) + 1000,
        cardName: cardName,
    }
}

const buildListOfCards = (numCards = 10) => {
    const cards = [];

    for (let i = 0 ; i < numCards ; i++) {
        cards.push(buildCard());
    }
    return cards;
}

const insertCardsInDb = async (cards) => {
    try {
        const result = await Card.insertMany(cards)
        console.log(`Successfully inserted ${result.length} cards`)
        return result
    } catch (error) {
        console.error('Error inserting cards:', error)
        throw error;
    }
}

const deleteAllCardsFromDb = async () => {
    try {
        await Card.deleteMany()
        console.log("Successfully deleted all cards from db")
    } catch (error) {
        console.error('Error deleting cards:', error)
        throw error
    }
}