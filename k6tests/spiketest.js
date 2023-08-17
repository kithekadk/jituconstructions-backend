import http from 'k6/http';
import {sleep} from 'k6'

export const options = {
    stages:[
        { duration: '2m', target: 2000 },
        { duration: '1m', target: 0 }
    ],
    thresholds:{
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(90) <600', 'p(95) < 700', 'p(99) < 1500']
    }
}

export default ()=>{
    http.get('http://localhost:4500/project')
    sleep(1)
}