import bcrypt from 'bcrypt'
import mssql from 'mssql'
import { registerEmployee } from './authController'

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