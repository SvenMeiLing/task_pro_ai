/* 
    *global console
    *FileName:index.js
    *PATH:src/directives
    *Time: 2024/5/31 15:52
    *Author: zzy
*/
import {Resize} from './resizeObserver'

const directives = {
    Resize,
}

export default {
    install(app) {
        Object.keys(directives).forEach((key) => {
            app.directive(key, directives[key])
        })
    }
}
