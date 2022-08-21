<template>
    <container-header>工具</container-header>
    <container-main style="padding: 16px">
        <el-row :gutter="16">
            <el-col :span="8">
                <el-card shadow="hover" class="item" @click="toRouter('/tool/backup')">备份</el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="item" @click="toRouter('/tool/import')">文章导入</el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="item" @click="toRouter('/tool/sync-remote')">远程同步</el-card>
            </el-col>
        </el-row>
        <el-row :gutter="16" style="margin-top: 16px">
            <el-col :span="8">
                <el-card shadow="hover" class="item">项目同步</el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="item" @click="toRouter('/tool/about/self')">关于</el-card>
            </el-col>
        </el-row>
    </container-main>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";

export default defineComponent({
    name: 'tool',
    components: {ContainerMain, ContainerHeader},
    data: () => ({}),
    methods: {
        toRouter(path: string) {
            this.$router.push(path);
        }
    }
});
</script>
<style scoped>
.item {
    cursor: pointer;
    user-select: none;
}
</style>