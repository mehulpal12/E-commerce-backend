import express from "express";
import cors from "cors"
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
configDotenv();
import productRoutes from "./routes/product.route.js"
import mongoose from "mongoose";
import { registerUser, loginUser, logoutUser } from "./controllers/user.controllers.js";
import  handler  from "./api/checkout.js";
import  uploadImage  from "./api/upload-image.js";
import  getImages  from "./api/get-images.js";


const app = express()
app.use(express.json({ limit: "10mb" }))
app.use(cors({
  origin: "e-commerce-frontend-five-ruby.vercel.app",
  credentials: true,
    methods: ['GET','POST','PUT','DELETE'],
}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req,res)=>{
 res.send("main page dfsda")
})
app.use("/api/products", productRoutes)
app.use("/api/upload-image", uploadImage)
app.use("/api/get-images", getImages)
app.use("/user/register", registerUser)
app.use("/api/checkout", handler)
app.use("/user/login", loginUser)
app.use("/user/logout", logoutUser)
const PORT = process.env.PORT || 5000;

// app.listen(PORT, ()=>{
//     console.log("server is run on " + PORT);
    
// })
//  const db = mongoose.connect(process.env.MONGO_URI)
// console.log(`db connected`+ process.env.MONGO_URI);

let isConnected = false;
async function connectDB() {

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }

}

app.use((req, res, next) => {
  if (!isConnected) {
    connectDB().then(() => next());
  } else {
    next();
  }
});

export default app