const mongoose=require('mongoose')

const connectDB=async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        //   useFindAndModify: true,
        });
    
       console.log("Connect to dataBase");
      } catch (error) {
        console.log(error);
      }
}
module.exports=connectDB