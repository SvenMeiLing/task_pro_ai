/* 
    *global console
    *FileName:http.js
    *PATH:src/utils
    *Time: 2024/6/1 16:07
    *Author: zzy
*/


// axios基础封装
import axios from 'axios'
import {NIcon} from "naive-ui";
import {HourglassBottomTwotone} from "@vicons/material";

const httpInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    timeout: 15000,
})
// axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data,
    e => {
        // 统一错误提示
        window.$message.warning(e.message)
        return e
    })

export default httpInstance
