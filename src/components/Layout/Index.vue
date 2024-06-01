<template>
    <n-layout position="absolute" style="height: 100%;">
        <LayoutHeader></LayoutHeader>
        <n-layout has-sider position="absolute" style="height: 90%;top:10%">
            <LayoutAside></LayoutAside>
            <LayoutContent></LayoutContent>
        </n-layout>
        <!--        <n-layout-footer>成府路</n-layout-footer>-->
    </n-layout>
</template>

<script setup>
import LayoutHeader from "@/components/Layout/components/LayoutHeader.vue";
import LayoutAside from "@/components/Layout/components/LayoutAside.vue";
import LayoutContent from "@/components/Layout/components/LayoutContent.vue";
import {useMessage} from 'naive-ui'

window.$message = useMessage()
</script>

<style scoped>

.n-layout-header,
.n-layout-footer {
    background: rgba(128, 128, 128, 0.2);
}

.n-layout-sider {
    background: rgba(128, 128, 128, 0.3);
}

.n-layout-content {
    background: rgba(128, 128, 128, 0.4);
}
</style>
