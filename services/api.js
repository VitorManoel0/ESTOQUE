import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:7894',
})

export default api
