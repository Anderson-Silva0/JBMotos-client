import axios from "axios"

export const ApiService = axios.create({
    baseURL: "http://192.168.1.101:8080/api"
})
