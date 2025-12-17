import axios from 'axios';

export const api = axios.create({
  baseURL: "https://syndic-app-mu.vercel.app/api",
  withCredentials: true
});
