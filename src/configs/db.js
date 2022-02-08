const mongoose = require('mongoose');

const url = 'mongodb+srv://classconnect:classconnect@clusterclassconnect.xxggr.mongodb.net/FBUsersData?retryWrites=true&w=majority';

const connectDB = async () => {

    const connection = await mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify:false,
        useUnifiedTopology: true 
    });
}

module.exports = connectDB;