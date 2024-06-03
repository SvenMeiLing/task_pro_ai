<template>
    <n-card :title="renderTitle" embedded hoverable class="h-full"
            header-style="padding-top:10px;padding-bottom:10px"
    >
        <template #header-extra>
            <n-space justify="start" class="h-full">
                <n-select
                        v-model:value="selectedValue"
                        @update:value="handleUpdateValue"
                        filterable
                        placeholder="选择语言"
                        :options="langOption.map(lang => ({value:lang, label:lang}))"
                />
                <n-button @click="receiveFunc(code)" class="p-2" :disabled="showSpin" type="primary" ghost>
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
            <n-scrollbar style="max-height: 400px">
                <div class="h-full w-full">
                    <prism-editor class="my-editor h-full" v-model="code" :highlight="highlighter"
                                  line-numbers></prism-editor>
                </div>
            </n-scrollbar>


        </template>

    </n-card>
</template>

<script setup>
// import Prism Editor
import Prism from 'prismjs'
import {PrismEditor} from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
// import highlighting library (you can use any library you want just return html string)
import {highlight, languages} from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript.js'
import 'prismjs/themes/prism-tomorrow.css';
import {getCurrentInstance, ref, watch} from "vue";
import {NIcon} from "naive-ui";
import {KeyboardOptionKeyOutlined} from "@vicons/material"; // import syntax highlighting styles

const code = ref('console.log("Hello World")')
const showSpin = ref(false)
// 切换语言
const selectedValue = ref('html')
const highlighter = (code) => {
    return highlight(code, languages[selectedValue.value], selectedValue.value); // languages.<insert language> to return html with markup
}


const renderTitle = () => {
    return h('div', {class: 'flex items-center'},
        [h(NIcon, {size: '30', class: ''}, {default: () => h(KeyboardOptionKeyOutlined)}),
            h('span', {class: 'font-thin text-xl'}, '代码输入')]
    )
}
const func = ref(null)
const langOption = ['html', 'javascript', 'css', 'sql', 'yaml', 'python', 'cpp', 'c', 'go', 'java']
// 接收评估函数
getCurrentInstance()?.proxy?.$bus.on("doAssess", (_func) => {
    console.log(_func, 1)
    func.value = _func
});

// 发送code
import {mitt1} from '@/EventBus/assess.js'
watch(code, (newVal) => {
    console.log(code)
    mitt1.emit("code", code);
})

const handleUpdateValue = (value) => {
    // 当选项发生变化时
    selectedValue.value = value
}
const receiveFunc = async (code) => {
    showSpin.value = true
    await func.value(code)
    showSpin.value = false
}


</script>

<style>

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
