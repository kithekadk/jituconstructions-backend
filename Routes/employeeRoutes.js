const {Router} = require('express')
const { registerEmployee, employeeLogin, checkUser } = require('../Controllers/authController')
const { verifyToken } = require('../Middleware/verifyToken')

const employeerouter = Router()

employeerouter.post('/register', registerEmployee)
employeerouter.post('/login', employeeLogin)
employeerouter.get('/check', verifyToken, checkUser)

module.exports ={
    employeerouter
}