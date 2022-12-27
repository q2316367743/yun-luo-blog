<template>
    <container-header>
        <el-tabs v-model="prettyActive" @tab-click="tabClick">
            <el-tab-pane label="主题" name="theme"></el-tab-pane>
            <el-tab-pane label="主题配置" name="theme-editor"></el-tab-pane>
            <el-tab-pane label="主题文件管理" name="file-manage"></el-tab-pane>
            <el-tab-pane label="插件" name="plugin"></el-tab-pane>
            <el-tab-pane label="资源文件管理" name="source-manage"></el-tab-pane>
        </el-tabs>
    </container-header>
    <container-main class="pretty">
        <div class="body">
            <el-scrollbar>
                <router-view/>
            </el-scrollbar>
        </div>
    </container-main>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import type {TabsPaneContext} from 'element-plus'

import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";
import Constant from "@/global/Constant";
import Hexo from "@/global/config/Hexo";
import FileApi from "@/api/FileApi";


export default defineComponent({
    name: 'pretty',
    components: {ContainerMain, ContainerHeader},
    data: () => ({
        prettyActive: 'theme',
    }),
    created() {
    },
    methods: {
        async tabClick(context: TabsPaneContext) {
            let paneName = context.paneName;
            if (paneName === 'file-manage') {
                // 初始化主题名
                let hexoConfigBase = await Constant.FILE.HEXO_CONFIG_BASE();
                let hexo = new Hexo(await FileApi.readFile(hexoConfigBase));
                // 获取主题目录
                let hexoThemePath = await Constant.FOLDER.HEXO.THEME();
                // 获取当前主题目录
                this.$router.push({
                    path: `/pretty/hexo/${paneName}`,
                    query: {
                        baseFolder: await FileApi.resolve(hexoThemePath, hexo.theme)
                    }
                });
            } else if (paneName === 'source-manage') {
                // source
                this.$router.push({
                    path: `/pretty/hexo/${paneName}`,
                    query: {
                        baseFolder: await Constant.FOLDER.SOURCE()
                    }
                });
            } else {
                this.$router.push(`/pretty/hexo/${paneName}`)
            }
        }
    }
});
</script>
<style scoped lang="less">
.pretty {

    .body {
        position: absolute;
        top: 16px;
        left: 16px;
        right: 16px;
        bottom: 16px;
    }
}
</style>