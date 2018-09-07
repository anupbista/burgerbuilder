import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burgerbuilder-9cd16.firebaseio.com/'
});

export default instance;