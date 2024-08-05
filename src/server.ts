import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from "./config/db";
import authRoutes from './routes/AuthRoutes'
import projectRoutes from './routes/ProjectRoutes'
import { corsConfig } from "./config/cors";
import morgan from "morgan";

dotenv.config()
connectDB()

const app = express()
app.use(cors(corsConfig))

//Logging
app.use(morgan('dev'))

//Read the form's data
app.use(express.json())

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)

export default app