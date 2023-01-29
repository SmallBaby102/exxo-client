import axios from 'axios';

let apiUrl = `${process.env.REACT_APP_BASE_URL}`;
const api = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem("authenticated")
    } 
});
console.log('====================================');
console.log("token", localStorage.getItem("authenticated"));
console.log('====================================');
export default api;
