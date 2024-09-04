//Importing Mongoose
import mongoose from 'mongoose';

/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to handle MongoDB Connection
 */

const handleMongoDBConnection = async () => {
  try {
    console.log('hai');
    mongoose.set('strictQuery', false);
    const res = await mongoose.connect(process.env.MONGOURI || '');
    console.log(`⚡️[MongoDB] - Connected: ${new Date().toDateString()} / ${new Date().toLocaleTimeString()}`);
    return res;
  } catch (err) {
    console.log('MongoDB Error: ', err);
  }
};

export default handleMongoDBConnection;
