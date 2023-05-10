import express from 'express'
import cookieParser from 'cookie-parser'
import userRoute from './routes/userRoute.js'
import taskRoute from './routes/taskRoute.js'
import errorHandlerMiddleware from './middlewares/errorHandler.js'
import cors from 'cors'

let app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true
}))

app.use('/api/v1', userRoute)
app.use('/api/v1', taskRoute)


app.use(errorHandlerMiddleware)
export default app