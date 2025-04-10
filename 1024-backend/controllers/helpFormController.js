const HelpForm = require('../models/HelpForm')

const nodemailer = require("nodemailer");

const sendHelpEmail = async (email, description) => {
  try {
    // Configurar el transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico
        pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación
      },
    });

    // Configurar el correo electrónico
    const mailOptions = {
      from: `"Soporte Tenfe" <${process.env.EMAIL_USER}>`, // Remitente
      to: process.env.EMAIL_USER, // Enviar a tu correo de soporte
      subject: "Nueva solicitud de ayuda", // Asunto del correo
      html: `
        <p>Has recibido una nueva solicitud de ayuda:</p>
        <p><strong>Correo del usuario:</strong> ${email}</p>
        <p><strong>Descripción del problema:</strong></p>
        <p>${description}</p>
        <p>Saludos,</p>
        <p>El equipo de Tenfe</p>
      `, // Cuerpo del correo en HTML
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions);
    console.log("Correo de solicitud de ayuda enviado a:", process.env.EMAIL_USER);
  } catch (error) {
    console.error("Error al enviar el correo de solicitud de ayuda:", error);
    throw error; // Lanzar el error para manejarlo en el controlador
  }
};

const helpFormController = {

    createHelpForm: async (req, res) => {
        try {
            const { email, description } = req.body;
    
            // Guardar en la base de datos
            const newHelpForm = new HelpForm({ email, description });
            await newHelpForm.save();
    
            // Enviar correo de solicitud de ayuda
            await sendHelpEmail(email, description);
    
            res.status(201).json({ message: "Solicitud de ayuda enviada con éxito." });
    
        } catch (err) {
            console.error("Error en createHelpForm:", err);
            res.status(500).json({ message: "Error al enviar la solicitud.", error: err.message });
        }
    },

    getHelpForm: async ( req , res ) => {
        try {
            const helpFormFound = await HelpForm.find();
            res.status(200).json(helpFormFound);
        } catch (err) {
            res.status(500).json({ message: "Error al obtener solicitudes", err });
        }
    },
};

module.exports = helpFormController;
