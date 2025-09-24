const { connect } = require('mongoose')
const config = require('../Config')
const Database = config.DATA_BASE || 'mongodb://127.0.0.1:27017/db_name'
async function ConnectDatabase() {
    try {
        await connect(Database)
        console.log("Database Connected")
    } catch (error) {
        console.log("Error in Backend", error)
    }
}

module.exports = ConnectDatabase

