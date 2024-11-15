import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORSS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '16k'}))
app.use(express.urlencoded({extended: true,limit: '16k'}))
app.use(express.static('public'))
app.use(cookieParser())

//routes import
import useRouter from './routes/user.routes.js'

app.use("/api/v1/users", useRouter)


export {app}