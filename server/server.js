import express,{json} from 'express';
const app =express();
import main from './ai.js'
import cors from "cors";
app.use(cors());

app.use(express.json());
app.post(`/chat`,async(req,res)=>
{
    
   const response =await main(req.body);
   console.log(response);
  
   
})

app.listen(`3000`,()=>
{
    console.log("server listing at port 3000")
})

