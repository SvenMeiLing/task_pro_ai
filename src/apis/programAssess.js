/* 
    *global console
    *FileName:programAssess.js
    *PATH:src/apis
    *Time: 2024/6/1 16:12
    *Author: zzy
*/
import request from '@/utils/http'
export function getAssessResult(data) {
    return request({
        url:'/coderv',
        method:'POST',
        data
    })
}
