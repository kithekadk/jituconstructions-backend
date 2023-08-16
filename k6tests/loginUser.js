import http from 'k6/http';
import {sleep, check} from 'k6';

export const options = {
    vus: 1,
    duration: '1s'
}

export default function(){
    const url = 'http://localhost:4500/employee/login';
    const body = JSON.stringify({
        email: 'john.wachira@yopmail.com',
        password: '12345678'
    })

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const response = http.post(url, body, params)
    // console.log(response);

    check(response, {
        'is status 200': (res)=>res.status === 200,
        'is successfully logged in': (res) => res.body.includes('Logged in')
    })

    sleep(1)
}