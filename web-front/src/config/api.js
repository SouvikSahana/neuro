import axios from "axios";

export const API_BASE_URL= "http://localhost:5000"

export const api=axios.create({
    baseURL: API_BASE_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

export const mediaApi= axios.create({
    baseURL: API_BASE_URL,
    headers:{
        "Content-Type": "multipart/form-data"
    }
})

api.interceptors.request.use(config=>{
    const token= localStorage.getItem("jwt")
    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }
    return config
}, error=>{
    return Promise.reject(error)
})

mediaApi.interceptors.request.use(config=>{
    const token= localStorage.getItem("jwt")
    if(token){
        config.headers.Authorization= `Bearer ${token}`
    }
     return config
},error=>{
    return Promise.reject(error)
})