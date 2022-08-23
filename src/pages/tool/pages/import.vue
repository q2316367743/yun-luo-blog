<template>
    <container-header>
        <el-page-header title="工具" content="文章导入" @back="goBack" style="margin-top: 8px;"/>
    </container-header>
    <container-main style="padding: 16px">
        <el-row :gutter="16" style="margin-top: 16px">
            <el-col :span="8">
                <el-tooltip
                    class="box-item"
                    effect="light"
                    content="从项目文件夹重新建立索引"
                    placement="bottom"
                >
                    <el-card shadow="hover" class="item" @click="projectDirRefresh">
                        项目目录刷新
                    </el-card>
                </el-tooltip>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" class="item">
                    Halo导入
                </el-card>
            </el-col>
        </el-row>
    </container-main>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";
import {postService} from "@/global/BeanFactory";
import {ElMessageBox} from "element-plus";
import Constant from "@/global/Constant";

export default defineComponent({
    name: 'tool-import',
    components: {ContainerMain, ContainerHeader},
    data: () => ({}),
    methods: {
        goBack() {
            this.$router.push('/tool');
        },
        projectDirRefresh() {
            Constant.FOLDER.POST().then(path => {
                postService.refresh(path).then(() => {
                    ElMessageBox.confirm("项目刷新完毕，是否立即前往文章页面？", "提示", {
                        type: 'success',
                        confirmButtonText: "前往",
                        cancelButtonText: "取消"
                    }).then(() => {
                        this.$router.push('/post/list');
                    }).catch(() => {
                    });
                })
            })
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