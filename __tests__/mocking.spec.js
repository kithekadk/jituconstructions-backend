const crypto = require('crypto')
const {generateBytes} = require("../Controllers/authController")

jest.mock("crypto")

test("Generate Bytes" , async ()=>{
    
    crypto.randomBytes.mockResolvedValueOnce("fhgdsjhgfjgfjgjfds")
    const res = await generateBytes()
    // console.log(res);
})


test('mock implementation', ()=>{
    const mockFN = jest.fn(()=> "default").mockImplementation(()=>{
        return "First Call";
    }).mockImplementation(()=>"Second Call")

    const res = mockFN()
    const res2 = mockFN()

    // console.log(res);
    // console.log(res2);
})

test('mock implementation Once', ()=>{
    const mockFN = jest.fn(()=> "default").mockImplementationOnce(()=>{
        return "First Call";
    }).mockImplementationOnce(()=>"Second Call")

    const res = mockFN()
    const res2 = mockFN()
    const res3 = mockFN()

    console.log(res);
    console.log(res2);
    console.log(res3);
})

