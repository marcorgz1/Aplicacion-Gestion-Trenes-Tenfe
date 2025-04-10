require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./routes/userRoutes");
const prefixRouter = require("./routes/countryPrefixRoutes");
const trainRouter = require("./routes/trainRoutes");
const passengerRouter = require("./routes/passengerRoutes");
const helpFormRouter = require("./routes/helpFormRoutes");
const ticketRouter = require("./routes/ticketRoutes");
const cardRouter = require("./routes/cardsRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/prefix", prefixRouter);
app.use("/trains", trainRouter);
app.use("/passenger", passengerRouter);
app.use("/help", helpFormRouter);
app.use("/card_validate" , cardRouter)
app.use("/ticket" , ticketRouter)
app.use("/card" , cardRouter)

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to BBDD"))
  .catch((error) => console.log("Error trying to connect to BBDD:", error));

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});
