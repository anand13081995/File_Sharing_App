const express = require("express");
const fileRoutes = require("./routes/fileRoutes");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.DATABASE_URI)
.then(() => console.log("DB Connected Successfully"))
.catch((err) => console.log("Error connecting Database", err));

app.use(express.json());

app.use(fileRoutes);


app.listen(10000, ()=>{
    console.log("Server is up and running at port 10000");
})