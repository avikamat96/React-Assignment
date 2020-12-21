import axios from 'axios';

let headers = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  };

export function getData(url,params){
    return axios.get(url,{headers: headers.headers, params: params})
}
