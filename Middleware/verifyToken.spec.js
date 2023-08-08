import jwt from 'jsonwebtoken';
import { verifyToken } from './verifyToken';

const mockRequest = ()=>{
    return {
        headers:{
            token: "valid_token"
        }
    }
}

const mockResponse = ()=>{
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }
}

const mockNext = jest.fn()

describe('Testing the middleware', ()=>{
    it('It throws missing token error', async ()=>{
        const mockReq = mockRequest().headers= {
            headers:{}
        }

        const mockRes = mockResponse()
        const next = mockNext()

        await verifyToken(mockReq, mockRes, next)

        expect(mockRes.json).toHaveBeenCalledWith({message: "Restricted access, please provide a token"}) 
        expect(mockRes.status).toHaveBeenCalledWith(403) 

    })

    it ("should authorize the users", async()=>{
        const mockUser = {
            id: "99f32f04-caab-43d2-a210-6bdf0a3320c4", 
            e_name: "John Wachira",
            email: "john.wachira@yopmail.com",
            role: "user",
            issent: false,
            profile: "https://cdn.pixabay.com/photo/2018/07/31/21/58/lion-3576031_640.jpg"
        }

        const outPutRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            info: mockUser
        }

        jest.spyOn(jwt, 'verify').mockResolvedValueOnce({
            outPutRes
        })

        await verifyToken(mockRequest, outPutRes, mockNext)

        expect(mockNext).toHaveBeenCalled()
        expect(mockNext).toHaveBeenCalledTimes(1)
        expect(mockNext).toBeCalledTimes(1)
    })
})