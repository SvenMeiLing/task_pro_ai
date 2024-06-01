<template>
    <n-layout-header position="absolute"
                     class="h-[10%] ps-5 pe-5"
    >
        <n-space align="center" justify="space-between" class="h-full">
            <n-space :wrap-item="false" :size="5" align="center" justify="center">

                <n-icon :component="WebOutlined" :size="30" color="#6495EDFF"></n-icon>

                <n-text class="text-xl font-thin">代码评估实训平台</n-text>


            </n-space>

            <n-space :wrap-item="false" :size="0" align="center" justify="center">
                <n-button type="info">
                    <n-text class="text-base text-yellow-50 me-1">登录</n-text>
                    <n-icon :component="LogInSharp" size="20"></n-icon>
                </n-button>
            </n-space>
        </n-space>
    </n-layout-header>
</template>

<script setup>
import {WebOutlined, LogInSharp} from '@vicons/material'
</script>

<style scoped>
q {
    color: black;
}

</style>
