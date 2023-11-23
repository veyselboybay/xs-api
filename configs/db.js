const mongoose = require('mongoose')


const PORT = process.env.PORT || 5000
const connectDbAndRunServer = async(app) => {    
    await mongoose.connect(process.env.DB_CONNECTION).then(() => {
        console.log("DB connected")
        // run server
        app.listen(PORT, () => {
            console.log(`server started on localhost:${PORT}`)
        })
    }).catch((err) => {
        console.log(err)
    })
}


module.exports = { connectDbAndRunServer }