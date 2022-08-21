<template>
    <container-header>
        <el-tabs v-model="prettyActive">
            <el-tab-pane label="主题" name="theme"></el-tab-pane>
            <el-tab-pane label="主题配置" name="themeEditor"></el-tab-pane>
            <el-tab-pane label="主题文件管理" name="themeFileManage"></el-tab-pane>
            <el-tab-pane label="插件" name="plugin"></el-tab-pane>
            <el-tab-pane label="package.json" name="packageJson"></el-tab-pane>
        </el-tabs>
    </container-header>
    <container-main class="pretty">
        <div class="body">
            <el-scrollbar>
                <pretty-hexo-theme-list v-if="prettyActive === 'theme'"></pretty-hexo-theme-list>
                <theme-editor v-else-if="prettyActive === 'themeEditor'"></theme-editor>
                <file-manage v-else-if="prettyActive === 'themeFileManage'"></file-manage>
                <plugin-pretty v-else-if="prettyActive === 'plugin'"></plugin-pretty>
                <pretty-hexo-package-json v-else-if="prettyActive === 'packageJson'"></pretty-hexo-package-json>
            </el-scrollbar>
        </div>
    </container-main>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";

import pluginPretty from "./components/PluginList.vue";
import FileManage from "@/pages/pretty/hexo/components/FileManage.vue";
import ThemeEditor from "./components/ThemeEditor.vue";
import PrettyHexoPackageJson from "@/pages/pretty/hexo/components/PackageJson.vue";
import PrettyHexoThemeList from "@/pages/pretty/hexo/components/ThemeList.vue";

export default defineComponent({
    name: 'pretty',
    components: {
        PrettyHexoThemeList,
        PrettyHexoPackageJson,
        ThemeEditor, FileManage, ContainerMain, ContainerHeader, pluginPretty
    },
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