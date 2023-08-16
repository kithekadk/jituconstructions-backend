import http from 'k6/http'
import {sleep} from 'k6'

export const options = {
    scenarions:{
        arbitrary_scenario_name: {
            executor: 'per-vu-iterations',
        }
    },
    iterations: 100,
    vus: 50,
}

export default function(){
    http.get('https://bit.ly/SAR2023-2024');
    sleep(1)
}