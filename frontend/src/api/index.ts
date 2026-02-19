import { DefaultApi, Configuration } from './generated';
import axios from 'axios';

const configuration = new Configuration({
    basePath: '/api/v1',
});

// Create an axios instance with base URL if needed, 
// but since we are serving from the same origin in production, 
// '/api/v1' as basePath should work fine.
const axiosInstance = axios.create();

export const api = new DefaultApi(configuration, undefined, axiosInstance);
