import axios from "axios"

export const ApiService = axios.create({
    baseURL: "http://192.168.0.120:8080/api"
})
