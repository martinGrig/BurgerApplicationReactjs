import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-e4f5a.firebaseio.com/'
});

export default instance;