const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const User = require("../models/User");

// Función para enviar el correo de bienvenida
const sendWelcomeEmail = async (email, name) => {
  try {
    // Configurar el transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Configurar el correo electrónico
    const mailOptions = {
      from: `"Soporte Tenfe" <${process.env.EMAIL_USER}>`, // Remitente
      to: email, // Destinatario
      subject: "¡Bienvenido a Tenfe!", // Asunto del correo
      html: `
        <p>Hola ${name},</p>
        <p>¡Te has registrado correctamente en Tenfe!</p>
        <p>Gracias por unirte a nuestra comunidad. Esperamos que disfrutes de nuestros servicios.</p>
        <p>Saludos,</p>
        <p>El equipo de Tenfe</p>
      `, // Cuerpo del correo en HTML
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions);
    console.log("Correo de bienvenida enviado a:", email);
  } catch (error) {
    console.error("Error al enviar el correo de bienvenida:", error);
    throw error; // Lanzar el error para manejarlo en el controlador
  }
};

const UsersController = {

  get: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  
  getUser: async (req, res) => {
    try {
      const response = await User.find();
      res.json(response);
    } catch (err) {
      console.log("Error:", err);
      res.status(500).json({ message: "No user getted" });
    }
  },

  getMe: async (req, res) => {
    try {
      const userFound = await UsersUseCases.getById(req.decodedToken.id);
      res.json(userFound);
    } catch (error) {
      console.log("Error:", err);
      res.status(500).json({ message: error.message });
    }
  },

  add: async (req, res) => {
    try {
      const { email, password, phone, name } = req.body;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;      
       
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "El email no tiene un formato válido." });
      }
  
      // - Contraseña: de 8 a 16 caracteres, al menos una mayúscula y un dígito, solo letras y números
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
      
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "La contraseña debe tener entre 8 y 16 caracteres, al menos una mayúscula y un número."
        });
      }

      const existingUser = await User.findOne({ email });

      // Si el usuario ya existe, enviamos un error
      if (existingUser) {
        return res.status(400).json({ message: "Ese usuario ya existe" });
      }

      if (!name || name.length === 0) {
        return res.status(400).json({ message: "El nombre es obligatorio" });
      }

      if (!phone || phone.length === 0) {
        return res.status(400).json({ message: "El teléfono es obligatorio" });
      }

      

      // // Hash de la contraseña y creación del nuevo usuario
      const data = req.body;
      const hashedPassword = await bcrypt.hash(
        data.password,
        process.env.SALT_ROUNDS || 10
      );
      const newUser = new User({ ...data, password: hashedPassword });
      console.log('New user:', newUser)
      await newUser.save();
      
    //      // Hash de la contraseña y creación del nuevo usuario
    // const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS || 10);
    // const newUser = new User({ email, password: hashedPassword, phone, name });
    // await newUser.save();

      // Enviar correo de bienvenida
      console.log("Enviando correo de bienvenida...");
      await sendWelcomeEmail(email, name);
      
      res.status(201).json(newUser);
    } catch (err) {
      console.log("Error:", err);
      res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    console.log(req.body);
    // primero cogemos el email y el password
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "El email no tiene un formato válido." });
    }
  
    // luego buscamos el usuario en la base de datos
    const user = await User.findOne({ email });
    // si el usuario no existe, devolvemos un error
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // luego comprobamos si el password es correcto
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // si el password es correcto, devolvemos el un token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ msg: "User logged in", token });
  },

  updateProfile: async (req, res) => {
    const userData = req.body
    const { id } = req.body

    console.log(userData)

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: userData }, // Actualizar solo campo concreto
        { new: true } // Devolver documento actualizado
      )

      if (!updatedUser) {
        return res.status(404).json({ msg: 'El usuario no ha sido encontrado.' })
      }
  
      res.json({ 
        updatedUser,
        msg: 'User updated correctly' 
      })
    } catch (err) {
      console.error('Error al actualizar la información del usuario:', err.message)
    }
  },

  updatePassword: async (req, res) => {
    try {
      // Obtener contraseña actual y nueva del usuario enviadas desde el forntend
      const { userId, currentPassword, newPassword } = req.body

      // Comprobar si existe una contraseña actual y una nueva
      if (!currentPassword || !newPassword) {
        return res.status(404).json({
          success: false,
          msg: "Error: Las contraseña actual y la nueva son requeridas.",
        });
      }

      const currentUser = await UsersUseCases.getById(userId);

      if (!currentUser) {
        return res.status(404).json({
          success: false,
          msg: "Error: Usuario no encontrado.",
        });
      }

      // Comprobar que la nueva contraseña no coincide con la contraseña actual
      const isNewPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );

      if (!isNewPasswordValid) {
        return res.status(404).json({
          success: false,
          msg: "Error: La nueva contraseña es incorrecta.",
        });
      }

      // Si la contraseña es válida, hashearla
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Actualizar la contraseña del usuario actual
      currentUser.password = hashedPassword
      await currentUser.save()

      res.status(200).json({
        success: true,
        msg: 'La contraseña se ha actualizado correctamente.'
      })
    } catch (err) {
      console.error('Error al actualizar la contraseña del usuario:', err.message)
      
      return res.status(500).json({
        success: false,
        msg: 'Error: El servidor no ha podido actualizar la contraseña:' + err.message
      })
    }
  },
  
  requestPasswordReset: async (req, res) => {
    const { email } = req.body; // Obtener el email del cuerpo de la solicitud

    try {
      // Verificar si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Generar el token de restablecimiento de contraseña
      const resetToken = jwt.sign(
        { id: user._id, email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // El token expira en 1 hora
      );

      // Construir el enlace de restablecimiento
      const frontendUrl = process.env.FRONTEND_URL; // URL del frontend desde las variables de entorno
      if (!frontendUrl) {
        throw new Error("La variable de entorno FRONTEND_URL no está definida.");
      }
      const resetLink = `${frontendUrl}/login/reset-password?token=${resetToken}`;
      console.log("Reset link generado:", resetLink);

      


      // Configurar el transporte de nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Configurar el correo electrónico
      const mailOptions = {
        from: `"Soporte Tenfe" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Restablecer contraseña",
        html: `
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${resetLink}">Click aquí</a>
          <p>Este enlace expirará en 1 hora.</p>
        `,
      };

      // Enviar el correo electrónico
      await transporter.sendMail(mailOptions);

      console.log("Correo de restablecimiento enviado:", resetLink);
      res.status(200).json({ success: true, message: "Correo enviado correctamente" });
    } catch (error) {
      console.error("Error en requestPasswordReset:", error);
      res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
  },
  
  executePasswordReset: async (req, res) => {
    const { token, newPassword } = req.body;
    try {
      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar al usuario asociado al token
      const user = await UsersUseCases.getById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña del usuario
      user.password = hashedPassword;
      await user.save();

      // Responder con éxito
      res.json({ success: true, message: "Contraseña actualizada correctamente" });
    } catch (error) {
      console.error("Error en executePasswordReset:", error);
      res.status(400).json({ success: false, message: "Token no válido o caducado", error: error.message });
    }
  }
};

const UsersUseCases = {
  check: async (userId) => {
    const user = await User.findById(userId);
    return user? true : false;
  },

  getById: async (id) => {
    return await User.findById(id);
  }
};

module.exports = {UsersController, UsersUseCases};
