import app from './src/app.js'
import connectDB from './src/db/db.js'
import config from './src/config/config.js'

const PORT = config.PORT;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})