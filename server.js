const express = require ('express');
const { projectrouter } = require('./Routes/projectRoutes');

const app  = express()

app.use(express.json())
app.use('/project', projectrouter)

app.use((err, req, res, next)=>{
    res.json({Error: err})
})

app.listen(4500, ()=>{
    console.log('Server running on port 4500');
})