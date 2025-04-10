const Card = require('../models/Card') ;

const cardValidateController = async (req, res) => {
    try {
        const { cardNumber, internetCode } = req.body;

        const card = await Card.findOne({ cardNumber });

        if (!card) {
            return res.status(404).json({ message: "Tarjeta no encontrada." });
        }

        if (card.cvv.toString() !== internetCode) {
            return res.status(400).json({ message: "Código de compras incorrecto." });
        }

        res.status(200).json({ message: "Tarjeta válida." });
    } catch (error) {
        res.status(500).json({ message: "Error en la validación de la tarjeta.", error });
    }
};

module.exports = cardValidateController