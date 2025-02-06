import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = { conn:null, promise:null};
}

export const connectToDB = async () => {
    if(cached.conn){
        return {isConnected : true};
    }

    if(!cached.promise) {
        const opts = {
            bufferCommands : true,
            maxPoolSize:10
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection)
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        throw new Error("error in mongo connection")
    }

    return {isConnected : true}
}