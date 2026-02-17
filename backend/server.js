require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
// const buildingRoutes = require('./routes/buildingRoutes');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/buildings", require("./routes/buildingRoutes"));
app.use("/api/complaints", require('./routes/complaintRoutes'));
app.use("/api/admin", require("./routes/adminRoutes"));




const PORT = process.env.PORT || 8080;
const dbURL = process.env.MONGO_URL || "mongodb://localhost:27017/civicFlow";

app.listen(PORT,()=>{
    console.log(`Server Started on URL http://localhost:${PORT}`);
});

app.get("/",(req,res)=>{
    res.send("<h2>Root Response Being Sent</h2>")
})

main()
.then(()=>{
    console.log("DB Connected Successfully");
})
.catch((err)=>{
    console.log("Error: ", err);
})

async function main(params) {
    await mongoose.connect(dbURL);   
}