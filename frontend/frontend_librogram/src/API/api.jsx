import axios from 'axios';
import baseUrl from '../env/env.json'
export default axios.create({
  baseURL: baseUrl.base_url,
  headers: {
    'Content-Type': 'application/json'
  }
});

