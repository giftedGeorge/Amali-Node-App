const mongoose = require('mongoose');
const logger = require('../logger');

async function ConnectToDb(){
    try{
        return mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
    } catch(e){
        logger.error(e);
    }
}

module.exports = ConnectToDb;