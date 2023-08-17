import http from 'k6/http'
import {sleep} from 'k6';

export const options = {
    stages:[
        { duration: '5s', target: 20},
        { duration: '10s', target: 100},
        { duration: '8s', target: 1}
    ],
    thresholds:{
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(90) < 500']
    }
}

export default ()=>{
    http.get('http://localhost:4500/project')
    sleep(1)
}