// src/lib/axios.ts (ou src/lib/index.ts)
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333', // Endereço do seu backend
})
