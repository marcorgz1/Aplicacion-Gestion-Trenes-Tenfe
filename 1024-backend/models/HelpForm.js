const mongoose = require("mongoose");

const HelpFormSchema = new mongoose.Schema ({
    email: {
        type: String,
        required: true,
        trim: true, //Para eliminar espacios
        validate: {
            validator: (value) => {
              return [...value].includes("@") && [...value].includes(".");
            },
        },
        message: "Email no valido. Intentalo de nuevo" 
    },

    description: {
        type: String,
        required: true,
    },
// Para saber fecha de la solicitud
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("HelpForm", HelpFormSchema);
