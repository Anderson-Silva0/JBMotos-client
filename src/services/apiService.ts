import axios from "axios"

export const ApiService = axios.create({
    baseURL: "https://0294-168-194-66-92.ngrok.io/api"
})
