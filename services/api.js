import axios from 'axios'
const ApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: ApiBaseUrl,
})

export default api
