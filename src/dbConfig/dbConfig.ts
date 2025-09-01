import mongoose from "mongoose";

export async function connectDB(){
   try {
    mongoose.connect(process.env.MONGO_URI!);
      const connection =  mongoose.connection;
      connection.on('connect', () => {
        console.log("MongoDb connected successfully");
      })

      connection.on('error', (err) => {
        console.log('MongoDb connection erroe. Please make sure MongoDb is running.' + err);
        process.exit();
        
      })
   } catch (error) {
    console.log("Something Went Wrong!", error);
   }
}