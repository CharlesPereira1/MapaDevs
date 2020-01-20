import axios from 'axios';

const api = axios.create({
  baseURL: 'exp://gd-hx6.anonymous.mobile.exp.direct:3333',
});

export default api;