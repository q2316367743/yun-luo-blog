<template>
    <div id="pretty">
        <div v-if="themeExits">
            <el-tabs v-model="prettyActive">
                <el-tab-pane label="主题" name="theme"></el-tab-pane>
                <el-tab-pane label="插件" name="plugin"></el-tab-pane>
            </el-tabs>
            <div class="body">
                <el-scrollbar>
                    <theme-pretty v-if="prettyActive === 'theme'"></theme-pretty>
                    <plugin-pretty v-else-if="prettyActive === 'plugin'"></plugin-pretty>
                </el-scrollbar>
            </div>
        </div>
        <el-empty v-else description="博客尚未初始化，请先初始化主题后或初始化主义后重试">
            <el-button type="primary" @click="createThemeFolder">主题初始化</el-button>
        </el-empty>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import themePretty from "./components/theme.vue";
import pluginPretty from "./components/plugin.vue";
import FileApi from "@/api/FileApi";
import Constant from "@/global/Constant";
import {ElMessage} from "element-plus";

export default defineComponent({
    name: 'pretty',
    components: {themePretty, pluginPretty},
    data: () => ({
        prettyActive: 'theme',
        themeExits: true
    }),
    created() {
        // 主题文件夹是否存在
        Constant.PATH.HEXO_THEME().then(path => {
            FileApi.exist(path).then(exist => {
                this.themeExits = exist;
            })
        })
    },
    methods: {
        createThemeFolder() {
            Constant.PATH.HEXO_THEME().then(path => {
                FileApi.createDir(path).then(() => {
                    ElMessage({
                        showClose: true,
                        type: "success",
                        message: "主题文件夹初始化成功"
                    })
                    Constant.PATH.HEXO_THEME().then(path => {
                        FileApi.exist(path).then(exist => {
                            this.themeExits = exist;
                        })
                    })
                })
            })
        }
    }
});
</script>
<style scoped lang="less">
#pretty {
    position: absolute;
    top: 10px;
    left: 20px;
    right: 20px;
    bottom: 10px;

    .body {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 10px;
    }
}
</style>