import app from './app.js'
import dotenv from 'dotenv'
import connectDB from './config/connect.js'

dotenv.config({
    path: './config/config.env'
})

let start = async() => {
    let server = app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`)
    })
    await connectDB(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to database')
    })
    .catch(err => {
        console.log(`Error: ${err}`)
        console.log('Exiting the server')
        server.close(() => {
            process.exit(1)
        })
    })
}


start()