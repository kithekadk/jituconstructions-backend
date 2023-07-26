const {Router} = require('express')
const { registerEmployee, employeeLogin } = require('../Controllers/authController')

const employeerouter = Router()

employeerouter.post('/register', registerEmployee)
employeerouter.post('/login', employeeLogin)

module.exports ={
    employeerouter
}