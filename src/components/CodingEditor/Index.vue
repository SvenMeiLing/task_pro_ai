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
import {getCurrentInstance, ref, watch} from "vue";
import {highlight, languages} from 'prismjs/components/prism-core';
// 必须导入,依靠prism加载预设语言选择
import Prism from 'prismjs'
import {PrismEditor} from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript.js'
import 'prismjs/themes/prism-tomorrow.css';

import {NIcon} from "naive-ui";
import {KeyboardOptionKeyOutlined} from "@vicons/material"; // import syntax highlighting styles

// 代码编辑器绑定值
const code = ref('console.log("Hello World")')
// 按钮加载触发
const showSpin = ref(false)
// 语言选项绑定值
const selectedValue = ref('html')

/*
* 编辑器高亮效果
 */
const highlighter = (code) => {
    return highlight(code, languages[selectedValue.value], selectedValue.value); // languages.<insert language> to return html with markup
}

/**
 * @description: 以dom形式渲染title
 */
const renderTitle = () => {
    return h('div', {class: 'flex items-center'},
        [h(NIcon, {size: '30', class: ''}, {default: () => h(KeyboardOptionKeyOutlined)}),
            h('span', {class: 'font-thin text-xl'}, '代码输入')]
    )
}

// 接收来自assess组件的函数
const doAssessFn = ref(null)

// 语言预设,配置在vite.config.js
const langOption = ['html', 'javascript', 'css', 'sql', 'yaml', 'python', 'cpp', 'c', 'go', 'java']


// 接收评估函数
getCurrentInstance()?.proxy?.$bus.on("doAssess", (_func) => {
    doAssessFn.value = _func
});

// 发送code
import {mitt1} from '@/EventBus/assess.js'

// code发生改变则发送一次事件传递,供assess组件接收到最新的值
watch(code, (newVal) => {
    console.log(code)
    mitt1.emit("code", code);
})

/**
 * @description 组件选择事件
 * @param value 变更的值
 */
const handleUpdateValue = (value) => {
    // 当选项发生变化时
    selectedValue.value = value
}

/**
 * @description 执行接收到的评估函数
 * @param code 编辑器中的代码
 */
const receiveFunc = async (code) => {
    // 开启加载效果
    showSpin.value = true
    await doAssessFn.value(code)
    // 结束加载效果
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
