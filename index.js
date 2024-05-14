import express from "express"
const app = express()
const PORT = process.env.PORT || 5500
import indexRouter from "./routes/index.js"
import cors from "cors"

app.use(express.json())
app.use(cors());
app.use('/', indexRouter);


app.listen(PORT, ()=> console.log(`Server is listening in http://localhost:${PORT}`));
