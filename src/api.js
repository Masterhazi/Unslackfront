
import axios from 'axios'

const api = axios.create({
  baseURL: "https://unslackback-production.up.railway.app/api"

,
})

export default api
