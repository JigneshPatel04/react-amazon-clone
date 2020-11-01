import axios from 'axios';

const instance = axios.create({
    baseURL:'http://localhost:5001/challenge-c438d/us-central1/api'  // The API URL
});

export default instance;