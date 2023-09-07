const {Router} = require('express')
const { registerEmployee, employeeLogin, checkUser, registerCaregiver } = require('../Controllers/authController')
const { verifyToken } = require('../Middleware/verifyToken')

const employeerouter = Router()

employeerouter.post('/register', registerEmployee)
employeerouter.post('/register_caregiver', registerCaregiver)
employeerouter.post('/login', employeeLogin)
employeerouter.get('/check', verifyToken, checkUser)

module.exports ={
    employeerouter
}