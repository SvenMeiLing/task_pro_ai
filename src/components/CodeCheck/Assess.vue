<template>
    <n-card embedded
            class="h-full"
            content-style="padding-top:10px"
            content-class="h-full"
    >
        <n-tabs type="line"
                animated class="h-full"
                pane-wrapper-class="h-full"
                default-value="preview"
                :value="tabsValue"
                @update:value="switchTabs"
        >
            <n-tab-pane
                    name="preview"
                    tab="效果预览"
                    class="h-full"
                    :display-directive="'show'"
            >
                <iframe class="h-full w-full" ref="iframe" src="" frameborder="1"></iframe>
            </n-tab-pane>
            <n-tab-pane name="assess" tab="代码评估" class="h-full w-full" :display-directive="'show'"
                        :disabled="disabled">
                <!-- 这是对您程序的评估-->
                <n-space class="h-full w-full"
                         align="center" justify="center"
                         :wrap-item="false"
                         style="border:1px solid red"
                         v-resize="onResize"
                         :wrap="false"
                >
                    <n-space class="h-full w-1/2" :wrap-item="false">
                        <div id="main" class="w-full h-full"></div>
                    </n-space>

                    <n-space vertical class="h-full py-[1.2rem] w-1/2" :wrap-item="false" :size="0">

                        <n-space
                                style="border:1px solid red"
                                vertical
                                class="h-full p-1 w-full"
                                :wrap-item="false"
                                :size="0">

                            <n-list hoverable>
                                <n-list-item class="h-full">
                                    <n-thing class="h-full"
                                             content-style="margin-top: 10px;"
                                    >
                                        <template #header-extra>
                                            <n-space class="w-full" align="center" justify="space-between">
                                                <n-text>评估结果:</n-text>
                                                <n-button size="small" type="error" @click="resetAssess">重置</n-button>
                                            </n-space>

                                        </template>
                                        <template #description>
                                            <n-scrollbar style="max-height: 300px">
                                                <transition-group
                                                        enter-active-class="animate__animated animate__fadeIn"
                                                        leave-active-class="animate__animated animate__fadeOut">
                                                    <n-list v-for="(item, index) of assessResult" bordered
                                                            v-show="item.show"
                                                            :key="index">
                                                        <n-list-item>
                                                            <n-thing class="w-full">
                                                                <template #header-extra>
                                                                    <n-space :size="10" :wrap-item="false">
                                                                        <n-skeleton v-if="loading" height="20px"
                                                                                    width="50%"
                                                                                    value="1"/>
                                                                        <n-text v-if="!loading">{{
                                                                            item.title
                                                                            }}
                                                                        </n-text>
                                                                        <n-tag v-if="!loading" :bordered="false"
                                                                               type="info"
                                                                               size="small">
                                                                            {{ item.score }}
                                                                        </n-tag>
                                                                    </n-space>

                                                                </template>
                                                                <template #description>
                                                                    <n-skeleton v-if="loading" text :repeat="2"/>
                                                                    <n-skeleton v-if="loading" text style="width: 60%"/>
                                                                    <n-text v-else>{{ item.comment }}</n-text>
                                                                </template>
                                                            </n-thing>
                                                        </n-list-item>
                                                    </n-list>
                                                </transition-group>
                                            </n-scrollbar>
                                        </template>
                                    </n-thing>
                                </n-list-item>
                            </n-list>
                        </n-space>

                    </n-space>
                </n-space>
            </n-tab-pane>

        </n-tabs>
    </n-card>

</template>

<script lang="ts" setup>
import {
    onMounted,
    ref, reactive,
    getCurrentInstance, watch
} from 'vue'
import {useMessage, NIcon} from "naive-ui";
import {HourglassBottomTwotone} from '@vicons/material'
import "animate.css"

import * as echarts from 'echarts/core';
import {
    ToolboxComponent,
    ToolboxComponentOption,
    LegendComponent,
    LegendComponentOption,
    TooltipComponent
} from 'echarts/components';
import {PieChart, PieSeriesOption} from 'echarts/charts';
import {LabelLayout} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';

import {getAssessResult} from '@/apis/programAssess'


echarts.use([
    ToolboxComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout,
    TooltipComponent
]);

type EChartsOption = echarts.ComposeOption<
    ToolboxComponentOption | LegendComponentOption | PieSeriesOption
>;


let chartDom: HTMLElement;
let myChart;
const message = useMessage(),
    option = reactive({
        tooltip: {
            show: true,
            trigger: 'item',
            confine: true, // 将 tooltip 框限制在图表区域内
        },

        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: '评估结果',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                padAngle: 5,
                itemStyle: {
                    borderRadius: 10,
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: false,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: []
            }
        ]
    });
const loading = ref(true)
const assessResult = reactive({
    correctness: {
        score: 99,
        title: '正确性',
        comment: "白日依山尽，黄河入海流 天若有情天亦老，人间正道是沧桑",
        show: true
    },
    normativeness: {
        score: 77,
        title: '规范性',
        comment: "黑发不知勤学早，白首方悔读书迟 借问酒家何处来，牧童遥指杏花村",
        show: true
    },
    integrity: {
        score: 33,
        title: '完整性',
        comment: "纸上得来终觉浅，得知此事要躬行",
        show: true
    },
    // 默认都为show状态，只有在myCharts触发mouseover期间为true，其余几个全为false
})
const iframe = ref(null)
const disabled = ref(true)
const tabsValue = ref('preview')

const switchTabs = (value) => {
    console.log(value)
    tabsValue.value = value
}

function deepMerge(target, source) {
    // 遍历对象的key
    for (let key in source) {
        // 如果取出值还是一个对象, 就递归调用
        if (source[key] instanceof Object) {
            // 拿到新的对象
            target[key] = deepMerge(target[key], source[key])
        } else {
            // 如果不是对象直接赋值
            target[key] = source[key]
        }
    }
    return target
}

const doAssess = async (code) => {
    // 做评估操作, 弹出提示信息
    message.warning("正在评估您的代码请稍后······", {
        icon: () => h(NIcon, null, {default: () => h(HourglassBottomTwotone)})
    })
    // 发起请求
    const res = await getAssessResult({code: code})

    // 请求失败直接结束函数
    if (!res) {
        return
    }
    // 关闭评分框的禁制
    disabled.value = false
    // 自动切换到评分框
    switchTabs("assess")
    // 合并更新数组内容
    deepMerge(assessResult, res.assess)
    // 将数据提供给图表, 先将对象转化为可迭代对象
    for (const [key, value] of Object.entries(assessResult)) {
        option.series[0].data.push(
            {value: value.score, name: value.title, key: key}
        )
    }
    myChart = echarts.init(chartDom, 'light');
    option && myChart.setOption(option);

    // 取消加载状态
    loading.value = false
    // 且换tabs时数据会重载,优化方式是v-show而不是默认的v-if
}

const resetAssess = () => {
    // 加载效果开启
    loading.value = true
    // 清空数据
    option.series[0].data.length = 0
    // 切换标签页并对评分页开启禁制
    switchTabs('preview')
    disabled.value = true

}
const onResize = (dom) => {
    myChart.resize()
}


// getCurrentInstance()?.proxy?.$bus.on("message", (data: any) => {
//     console.log(data); //A组件的数据
// });
// 发送进行评估的函数供其调用
getCurrentInstance()?.proxy?.$bus.emit("doAssess", doAssess);

// 接收代码变更以触发预览框更新
import {mitt1} from '@/EventBus/assess.js'

mitt1.on("code", (code) => {
    console.log(iframe.value)
    // 监听用户输入的代码, 实现实时生成iframe预览效果
    let blob = new Blob([code.value], {
        type: 'text/html'
    })
    iframe.value.setAttribute('src', URL.createObjectURL(blob))
});

onMounted(() => {
    chartDom = document.getElementById('main')!;
    myChart = echarts.init(chartDom, 'light');
    option && myChart.setOption(option);

    myChart.on('mouseover', (echartObj) => {
        const {data} = echartObj
        // a in [b,c,a]
        Object.keys(assessResult).forEach((value, index) => {
            let key = data.key // 当前鼠标悬浮元素的key
            if (key !== value) {
                console.log(key, value)
                // 只要不是我当前移入的元素，其他元素都不显示
                assessResult[value].show = false
            }
        })
    })

    myChart.on('mouseout', (echartObj) => {
        const {data} = echartObj
        Object.keys(assessResult).forEach((value) => {
            assessResult[value].show = true
        })
    })

})
</script>
<style>
.n-thing-header__extra {
    width: 100%;
}

</style>
