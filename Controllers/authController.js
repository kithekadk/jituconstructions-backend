const mssql = require('mssql')
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const crypto =  require('crypto')
const {v4} = require ('uuid')
const { createEmployeesTable } = require('../Database/Tables/createTables')
const { sqlConfig } = require('../Config/config')
const dotenv = require ('dotenv')
const { loginSchema, registerSchema } = require('../Validators/employeeValidators')
dotenv.config()

const registerEmployee = async (req, res)=>{
    try {
        // createEmployeesTable()

        const id = v4();
        const {e_name, email,profile, password} = req.body

        if(!e_name || !email || !profile || !password){
            return res.status(400).json({
                error: "Please input all values"
            })
        }

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
        .input('profile', mssql.VarChar, profile)
        .input('password', mssql.VarChar, hashedPwd)
        .execute('registerEmployeePROC')

        // console.log(result);

        if (result.rowsAffected == 1){
            return res.status(200).json({
                message: 'Employee registered successfully'
            })
        }else{
            return res.status(400).json({
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

        if(!email || !password){
            return res.status(400).json({
                error: "Please input all values"
            })
        }

        // const {error} = loginSchema.validate(req.body)

        // if(error){
        //     return res.status(422).json(error.details)
        // }

        const pool = await mssql.connect(sqlConfig)

        const result = (await pool.request().input('email', email).execute('employeeLogin'))
        
        if(result?.rowsAffected == 1){
            const user = result.recordset[0]

            const hashedPwd = user.password

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
                    message: 'Incorrect password'
                })
            }
        }else{
            return res.status(400).json({message: "Email does not exist"})
        }

    } catch (error) {
        return res.json({Error:error})
    }
}

const checkUser = async(req, res)=>{
    if(req.info){
        res.json({
            info:req.info
            // name:req.info.e_name,
            // email: req.info.email,
            // role: req.info.role
        })
    }
}

const generateBytes = ()=>{
    const bytes = crypto.randomBytes(20)
    // console.log(bytes);
    return bytes
}

generateBytes()

module.exports = {
    registerEmployee,
    employeeLogin,
    checkUser,
    generateBytes
}