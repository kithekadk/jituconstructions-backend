const express = require ('express');
const cors = require ('cors')
const bodyParser = require('body-parser');
const { projectrouter } = require('./Routes/projectRoutes');
const { employeerouter } = require('./Routes/employeeRoutes');

const app  = express()

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(cors())
app.use('/project', projectrouter)
app.use('/employee', employeerouter)

app.use((err, req, res, next)=>{
    res.json({Error: err})
})

app.listen(4500, ()=>{
    console.log('Server running on port 4500');
})