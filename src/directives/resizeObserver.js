/* 
    *global console
    *FileName:resizeObserver.js
    *PATH:src/directives
    *Time: 2024/5/31 15:47
    *Author: zzy
*/

const map = new WeakMap()
const ob = new ResizeObserver(entires => {
    for (const entry of entires) {
        // 获取dom元素的回调
        const handler = map.get(entry.target)

        // 存在回调函数
        if (handler) {
            handler({
                width: entry.borderBoxSize[0].inlineSize,
                height: entry.borderBoxSize[0].blockSize
            })
        }
    }
})

export const Resize = {
    mounted(el, binding) {
        map.set(el,binding.value)
        ob.observe(el)
    },
    unmounted(el) {
        ob.unobserve(el)
    }
}

export default Resize
