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
                <Index></Index>
            </template>
            <template #2>
                <Assess></Assess>
            </template>
        </n-split>
    </n-layout-content>
</template>

<script setup>
// import Prism Editor
import {onMounted, ref} from 'vue'
import Assess from "@/components/CodeCheck/Assess.vue";
import Index from "@/components/CodingEditor/Index.vue";

// const languageList = Object.keys(components.languages).map((x) => {
//     return {label: x, value: x}
// })

</script>

<style>
iframe {
    /*阻止指针事件的传递*/
    pointer-events: none
}

</style>
