const mssql = require('mssql')
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const {v4} = require ('uuid')
const { createEmployeesTable } = require('../Database/Tables/createTables')
const { sqlConfig } = require('../Config/config')
const dotenv = require ('dotenv')
const { loginSchema, registerSchema } = require('../Validators/employeeValidators')
dotenv.config()

const registerEmployee = async (req, res)=>{
    try {
        createEmployeesTable()
        const id = v4();
        const {e_name, email, password} = req.body

        const {error} = registerSchema.validate(req.body)

        if(error){
            return res.status(422).json(error.details)
        }

        const hashedPwd = await bcrypt.hash(password, 5)

        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
        .input('id', id)
        .input('e_name', mssql.VarChar, e_name)
        .input('email', mssql.VarChar, email)
        .input('password', mssql.VarChar, hashedPwd)
        .execute('registerEmployeePROC')

        console.log(result);

        if (result.rowsAffected == 1){
            return res.status(200).json({
                message: 'Employee registered successfully'
            })
        }else{
            return res.status(200).json({
                message: 'Employee registration failed'
            })
        }


    } catch (error) {
        return res.json({Error:error})
    }
}

const employeeLogin = async(req, res)=>{
    try {
        const {email, password} = req.body

        const {error} = loginSchema.validate(req.body)
        if(error){
            return res.status(422).json(error.details)
        }

        const pool = await mssql.connect(sqlConfig)

        const user = (await pool.request().input('email', email).execute('employeeLogin')).recordset[0]

        // console.log(user);

        const hashedPwd = user.password

        if(user){
            const comparePwd = await bcrypt.compare(password, hashedPwd)
   
            if(comparePwd){
                const {password , ...payload} =user
                const token = jwt.sign(payload, process.env.SECRET, {expiresIn: '36000s'} )
                return res.status(200).json({
                    message: 'Logged in',
                    token
                })
            }else{
                return res.status(400).json({
                    message: 'Invalid login credentials'
                })
            }
        }else{
            return res.status(400).json({message: "Email does not exist"})
        }

    } catch (error) {
        return res.json({Error:error})
    }
}

module.exports = {
    registerEmployee,
    employeeLogin
}