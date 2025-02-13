const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(express.json())
app.use(cors())

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req,res)=>{
    const {character , user_message} = req.body;

    if(!character || !user_message){
        return res.status(400).json({error: "Character and message is required"})
    }

    const prompt = `You are ${character} of the movie. Respond to: ${user_message}`;

    try{
        
        const response = await axios.post('https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                message: [{role: "system", content: prompt}]
            },
            {
                headers:{
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ response: response.data.choices[0].message.content });
       
    }catch(err){
        res.json({error:err});
    }
    
})

app.listen(process.env.PORT,()=>{
    console.log("server is running");
})