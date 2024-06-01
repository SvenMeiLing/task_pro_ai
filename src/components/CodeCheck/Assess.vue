<template>
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
            <n-text class="h-auto w-full">这是对您代码的评估</n-text>
            <n-space

                    style="border:1px solid red"
                    vertical
                    class="h-full p-1 w-full"
                    :wrap-item="false"
                    :size="0">

                <n-list hoverable>
                    <n-list-item class="h-full">
                        <n-thing class="h-full" title="评估结果:" content-style="margin-top: 10px;">
                            <template #description>
                                <n-scrollbar style="max-height: 300px">
                                    <transition-group
                                            enter-active-class="animate__animated animate__fadeIn"
                                            leave-active-class="animate__animated animate__fadeOut">
                                        <n-list v-for="(item, index) of assessResult" bordered v-show="item.show"
                                                :key="index">
                                            <n-list-item>
                                                <n-thing class="w-full">
                                                    <template #header-extra>
                                                        <n-skeleton height="20px" width="50%" value="1"/>
                                                    </template>
                                                    <template #description>
                                                        <n-skeleton text :repeat="2"/>
                                                        <n-skeleton text style="width: 60%"/>
                                                    </template>
                                                </n-thing>
                                            </n-list-item>
                                        </n-list>
                                    </transition-group>

                                    <!--                                    <n-list bordered v-show="assesResult.normativeness.show">-->
                                    <!--                                        <n-list-item>-->
                                    <!--                                            <n-thing class="thing-title">-->
                                    <!--                                                <template #header-extra>-->
                                    <!--                                                    <n-skeleton height="20px" width="50%" value="1"/>-->
                                    <!--                                                </template>-->
                                    <!--                                                <template #description>-->
                                    <!--                                                    <n-skeleton text :repeat="2"/>-->
                                    <!--                                                    <n-skeleton text style="width: 60%"/>-->
                                    <!--                                                </template>-->
                                    <!--                                            </n-thing>-->
                                    <!--                                        </n-list-item>-->
                                    <!--                                    </n-list>-->
                                    <!--                                    <n-list bordered v-show="assesResult.integrity.show">-->
                                    <!--                                        <n-list-item>-->
                                    <!--                                            <n-thing class="thing-title">-->
                                    <!--                                                <template #header-extra>-->
                                    <!--                                                    <n-skeleton height="20px" width="50%" value="1"/>-->
                                    <!--                                                </template>-->
                                    <!--                                                <template #description>-->
                                    <!--                                                    <n-skeleton text :repeat="2"/>-->
                                    <!--                                                    <n-skeleton text style="width: 60%"/>-->
                                    <!--                                                </template>-->
                                    <!--                                            </n-thing>-->
                                    <!--                                        </n-list-item>-->
                                    <!--                                    </n-list>-->
                                </n-scrollbar>
                            </template>
                        </n-thing>
                    </n-list-item>
                </n-list>
                <!--                <n-h5 prefix="bar" type="info">-->
                <!--                    代码正确性评估:-->
                <!--                </n-h5>-->
                <!--                <n-h5 prefix="bar" type="info">-->
                <!--                    代码完整性评估:-->
                <!--                </n-h5>-->
                <!--                <n-h5 prefix="bar" type="info">-->
                <!--                    代码规范性评估:-->
                <!--                </n-h5>-->

            </n-space>

            <!--            <n-skeleton height="40px" width="33%" value="1"/>-->
            <!--            <n-skeleton height="40px" width="66%" :sharp="false"/>-->
            <!--            <n-skeleton height="40px" width="77%"/>-->
            <!--            <n-skeleton height="40px" width="99%"/>-->
        </n-space>
    </n-space>

</template>

<script lang="ts" setup>
import {
    onMounted,
    ref, reactive,
    getCurrentInstance
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

var option: EChartsOption;
let chartDom: HTMLDivElement;
let myChart;
const message = useMessage()
option = {
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
            data: [
                {value: 100, name: '正确性', key: 'correctness'},
                {value: 79, name: '规范性', key: 'normativeness'},
                {value: 99, name: '完整性', key: 'integrity'},
            ]
        }
    ]
};

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

const doAssess = async (code) => {
    // 做评估操作, 弹出提示信息
    message.warning("正在评估您的代码请稍后······", {
        icon: () => h(NIcon, null, {default: () => h(HourglassBottomTwotone)})
    })
    // 发起请求
    const res = await getAssessResult({code: code})
    console.log(res)

}
const onResize = (dom) => {
    myChart.resize()
}


// getCurrentInstance()?.proxy?.$bus.on("message", (data: any) => {
//     console.log(data); //A组件的数据
// });
getCurrentInstance()?.proxy?.$bus.emit("doAssess", doAssess);
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
