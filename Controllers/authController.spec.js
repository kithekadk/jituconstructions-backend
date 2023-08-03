import bcrypt from 'bcrypt'
import mssql from 'mssql'
const jwt = require("jsonwebtoken")
import { employeeLogin, registerEmployee } from './authController'

const req = {
    body: {
        e_name: "Gift Mwasighe",
        email: "gift@yopmail.com",
        profile: "https://cdn.pixabay.com/photo/2018/07/31/21/58/lion-3576031_640.jpg",
        password: "12345678"
    }
}

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
}

describe('Register an Employee', ()=>{

    it('should register a new employee successfully', async()=>{
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("kjhgsaiuytwiulkyiyui")

        const mockedInput = jest.fn().mockReturnThis()

        const mockedExecute = jest.fn().mockResolvedValue({rowsAffected: [1]})

        const mockedRequest ={
            input: mockedInput,
            execute: mockedExecute
        }

        const mockedPool ={
            request: jest.fn().mockReturnValue(mockedRequest)
        }

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool)

        await registerEmployee(req, res)

        expect(mockedInput).toHaveBeenCalledWith('email', mssql.VarChar, 'gift@yopmail.com');
        expect(mockedInput).toHaveBeenCalledWith('password', mssql.VarChar, 'kjhgsaiuytwiulkyiyui');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Employee registered successfully'
        })

        expect(mockedExecute).toHaveBeenCalledWith('registerEmployeePROC');
        expect(mockedInput).toHaveBeenCalledWith('id', expect.any(String))
    })

    it('Fails if body is missing email or password', async ()=>{
        const request = {
            body:{
                e_name: "Gift Mwasighe",
                email: "gift@yopmail.com",
            }
        }

        await registerEmployee(request, res)
        expect(res.json).toHaveBeenCalledWith({error: "Please input all values"})
    })

    it('Fails with error email already exists', async()=>{
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("kjhgsaiuytwiulkyiyui")

        const mockedInput = jest.fn().mockReturnThis()

        const mockedExecute = jest.fn().mockResolvedValue({rowsAffected: [0]})

        const mockedRequest ={
            input: mockedInput,
            execute: mockedExecute
        }

        const mockedPool ={
            request: jest.fn().mockReturnValue(mockedRequest)
        }

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool)

        await registerEmployee(req, res)

        expect (res.json).toHaveBeenCalledWith({
            message: 'Employee registration failed'
        })
    })
})

jest.mock("bcrypt")
jest.mock("jsonwebtoken")

describe("Employee login tests", ()=>{

    // afterEach(()=>{
    //     jest.restoreAllMocks()
    // })

    it("should return an error if email or password is missing", async ()=>{
        const req = {body:{}}

        await employeeLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            error: "Please input all values"
        })
    })

    it("should return an error if email is not found/registered", async()=>{
        const req = {
            body:{
                email: "abc@gmail.com",
                password: "12345678"
            }
        }

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({rowsAffected:0})
        })

        await employeeLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message: "Email does not exist"})
    })

    it("should return an error if password is incorrect", async()=>{
        const expectedUser = {
            id: '99f32f04-caab-43d2-a210-6bdf0a3320c4',
            e_name: 'John Wachira',
            email: 'john.wachira@yopmail.com',
            password: '$2b$05$18uIWBCUljHauB1AatayZOJneM7hm00aFGqui58fouMc1F48PgMJi',
            role: 'user',
            issent: false,
            profile: 'https://cdn.pixabay.com/photo/2018/07/31/21/58/lion-3576031_640.jpg'
        }

        const req ={
            body:{
                email: expectedUser.email,
                password: "incorrect_pwd"
            }
        }

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: 1,
                recordset: [expectedUser]
            })
        })

        bcrypt.compare.mockResolvedValueOnce(false)

        await employeeLogin(req, res)

        expect(res.json).toHaveBeenCalledWith({message: 'Incorrect password'})

        bcrypt.compare.mockRestore()
    })

    it("should return a token and log in user successfully", async ()=>{
        const expectedUser = {
            id: '99f32f04-caab-43d2-a210-6bdf0a3320c4',
            e_name: 'John Wachira',
            email: 'john.wachira@yopmail.com',
            password: '$2b$05$18uIWBCUljHauB1AatayZOJneM7hm00aFGqui58fouMc1F48PgMJi',
            role: 'user',
            issent: false,
            profile: 'https://cdn.pixabay.com/photo/2018/07/31/21/58/lion-3576031_640.jpg'
        }

        const req ={
            body:{
                email: expectedUser.email,
                password: "correct_pwd"
            }
        }

        const response ={
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, "connect").mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: 1,
                recordset: [expectedUser]
            })
        })

        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

        // jwt.sign.mockResolvedValueOnce('jwt_token');
        jest.spyOn(jwt, 'sign').mockReturnValueOnce("mockedToken")

        await employeeLogin(req, response)

        // expect(res.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
            message: 'Logged in',
            token: "mockedToken"
        })
    })
})  