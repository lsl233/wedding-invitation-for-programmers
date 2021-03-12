const axios = require('axios')

const instance = axios.create({
  baseURL: '/api',
  timeout: 1000,
})

instance.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
)


instance.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default instance