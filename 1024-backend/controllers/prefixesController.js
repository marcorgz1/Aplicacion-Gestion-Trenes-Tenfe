const countryPrefixes = require("../models/CountryPrefixes");

const countryPrefix = {
  getCountryPrefix: async (req, res) => {
    try {
      const response = await countryPrefixes.find();
      res.json(response);
    } catch (err) {
      console.log("Error:", err);
      res.status(500).json({ message: "No prefix getted" });
    }
  },

  addCountryPrefix: async (req, res) => {
    try {
      const { prefix, country } = req.body; // Asegúrate de obtener tanto el prefijo como el país

      // Verificar si ya existe el prefijo en la base de datos
      const existingPrefix = await countryPrefixes.findOne({ prefix });

      if (existingPrefix) {
        // Si ya existe, se devuelve el prefijo encontrado
        return res.json(existingPrefix);
      }

      // Si no existe, creamos un nuevo prefijo
      const newPrefix = new countryPrefixes({ prefix, country }); // Asegúrate de pasar ambos campos al crear el nuevo prefijo
      await newPrefix.save();

      return res.status(201).json(newPrefix); // Enviar el nuevo prefijo creado
    } catch (err) {
      console.log("Error:", err);
      return res.status(500).json({ message: err.message });
    }
  }
};

module.exports = countryPrefix;
