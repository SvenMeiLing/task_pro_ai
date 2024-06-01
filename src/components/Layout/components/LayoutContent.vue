<template>
    <n-layout-content content-style="padding: 5px;height:100%" class="h-full border-3 border-sky-400">
        <n-split
                direction="horizontal"
                :default-size="0.5"
                min="200px"
                max="700px"
                :resize-trigger-size="7"
                @drag-start="handleOnDragStart"
                @drag-move="handleOnDragMove"
        >
            <template #1>
                <n-card :title="renderTitle" embedded hoverable class="h-full"
                        header-style="padding-top:10px;padding-bottom:10px"
                >
                    <template #header-extra>
                        <n-space justify="start" class="h-full">
                            <n-select
                                    v-model:value="selectedValue"
                                    filterable
                                    placeholder="选择语言"
                                    :options="languageList"
                            />
                            <n-button @click="reciveFun(code)" class="p-2" :disabled="showSpin" type="primary" ghost>
                                <span>评估</span>
                                <n-spin :show="showSpin" :size="15">
                                    <template #default>
                                        <div v-show="showSpin" class="pl-2 w-[15px] h-[15px]"></div>
                                    </template>
                                </n-spin>
                            </n-button>
                        </n-space>

                    </template>
                    <template #default>

                        <hr>
                        <prism-editor class="my-editor rounded" v-model="code" :highlight="highlighter"
                                      line-numbers></prism-editor>
                    </template>

                </n-card>

            </template>
            <template #2>
                <n-card embedded
                        class="h-full"
                        content-style="padding-top:10px"
                        content-class="h-full"
                >
                    <n-tabs type="line" animated class="h-full" pane-wrapper-class="h-full" default-value="jay chou">
                        <n-tab-pane
                                name="the beatles"
                                tab="效果预览"
                                class="h-full"
                                :display-directive="'show'"
                        >
                            <iframe class="h-full w-full" ref="iframe" src="" frameborder="1"></iframe>
                        </n-tab-pane>
                        <n-tab-pane name="jay chou" tab="代码评估" class="h-full w-full">
                            <!-- 这是对您程序的评估-->
                            <Assess></Assess>
                        </n-tab-pane>
                    </n-tabs>
                </n-card>

            </template>
        </n-split>
    </n-layout-content>
</template>

<script setup>
// import Prism Editor
import {getCurrentInstance, onMounted, ref} from 'vue'
import components from 'prismjs/components.js'
import {PrismEditor} from 'vue-prism-editor';
import {NIcon} from 'naive-ui'
import {KeyboardOptionKeyOutlined} from '@vicons/material'
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
// import highlighting library (you can use any library you want just return html string)
import {highlight, languages} from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-dark.css'; // import syntax highlighting styles

const split = ref(0.5)
const code = ref()
const iframe = ref(null)
const showSpin = ref(false)
const selectedValue = ref('javascript')
const languageList = Object.keys(components.languages).map((x) => {
    return {label: x, value: x}
})
const highlighter = (code) => {
    return highlight(code, languages.js); // languages.<insert language> to return html with markup
}
const renderTitle = () => {
    return h('div', {class: 'flex items-center'},
        [h(NIcon, {size: '30', class: ''}, {default: () => h(KeyboardOptionKeyOutlined)}),
            h('span', {class: 'font-thin text-xl'}, '代码输入')]
    )
}
const func = ref(null)


getCurrentInstance()?.proxy?.$bus.on("doAssess", (_func) => {
    console.log(_func, 1)
    func.value = _func
});
const reciveFun = async (code) => {
    showSpin.value = true
    await func.value(code)
    showSpin.value = false
}


const example = [
    {label: 1, value: 1},
    {label: 2, value: 2},
    {label: 3, value: 3},
]


onMounted(() => {
    watch(code, () => {
        // 监听用户输入的代码, 实现实时生成iframe预览效果
        console.log(iframe)
        let blob = new Blob([code.value], {
            type: 'text/html'
        })
        iframe.value.setAttribute('src', URL.createObjectURL(blob))
    })
})

</script>

<style>
iframe {
    /*阻止指针事件的传递*/
    pointer-events: none
}

/* required class */
.my-editor {
    /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
    /*background: #2d2d2d;*/
    /*color: #ccc;*/

    /* you must provide font-family font-size line-height. Example: */
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
    outline: none;
}

.prism-editor__container {
    border-bottom: 1px solid black
}
</style>
