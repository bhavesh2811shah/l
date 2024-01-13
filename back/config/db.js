import mongoose from "mongoose";
import colors from "colors";
const connectDB = async () => {
  // try {
  //   const conn = await mongoose.connect(process.env.MONGO_URL);
  //   console.log(
  //     `Conneted To Mongodb Databse ${conn.connection.host}`.bgMagenta.white
  //   );
  // } catch (error) {
  //   console.log(`Errro in Mongodb ${error}`.bgRed.white);
  // }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      colors.bgMagenta.white(`Connected To MongoDB Database ${conn.connection.host}`)
    );
  } catch (error) {
    console.log(colors.bgRed.white(`Error in MongoDB: ${error}`));
  }
};

export default connectDB;


 
