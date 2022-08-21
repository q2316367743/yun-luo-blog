<template>
    <container-header>
        <el-tabs v-model="prettyActive">
            <el-tab-pane label="主题" name="theme"></el-tab-pane>
            <el-tab-pane label="主题配置" name="themeEditor"></el-tab-pane>
            <el-tab-pane label="主题文件管理" name="themeFileManage"></el-tab-pane>
            <el-tab-pane label="插件" name="plugin"></el-tab-pane>
        </el-tabs>
    </container-header>
    <container-main class="pretty">
        <div class="body">
            <el-scrollbar>
                <theme-pretty v-if="prettyActive === 'theme'"></theme-pretty>
                <theme-editor v-else-if="prettyActive === 'themeEditor'"></theme-editor>
                <file-manage v-else-if="prettyActive === 'themeFileManage'"></file-manage>
                <plugin-pretty v-else-if="prettyActive === 'plugin'"></plugin-pretty>
            </el-scrollbar>
        </div>
    </container-main>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";

import themePretty from "./components/theme.vue";
import pluginPretty from "./components/plugin.vue";
import FileManage from "@/pages/pretty/hexo/components/FileManage.vue";
import ThemeEditor from "./components/ThemeEditor.vue";

export default defineComponent({
    name: 'pretty',
    components: {ThemeEditor, FileManage, ContainerMain, ContainerHeader, themePretty, pluginPretty},
    data: () => ({
        prettyActive: 'theme',
    }),
    created() {
    },
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