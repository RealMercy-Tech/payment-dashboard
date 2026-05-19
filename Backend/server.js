import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import transferRoutes from "./routes/transfer.js";
import { authLimiter} from "./middleware/ratelimiter.js";
import env from "dotenv";

env.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: "https://payment-dashboard-three.vercel.app",
    credentials: true,
}));
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.send("Server is working");
})

// auth route
app.use("/api/auth", authLimiter, authRoutes);

// transfer route
app.use("/api/transfer", transferRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})