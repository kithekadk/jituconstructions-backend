const {Router} = require('express')
const { registerEmployee, employeeLogin, checkUser, registerCaregiver, getCaregivers } = require('../Controllers/authController')
const { verifyToken } = require('../Middleware/verifyToken')

const employeerouter = Router()

employeerouter.post('/register', registerEmployee)
employeerouter.post('/register_caregiver', registerCaregiver)
employeerouter.get('/get_caregivers', getCaregivers)
employeerouter.post('/login', employeeLogin)
employeerouter.get('/check', verifyToken, checkUser)

module.exports ={
    employeerouter
}