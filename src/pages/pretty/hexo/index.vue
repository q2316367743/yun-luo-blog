<template>
    <div id="container-header" style="padding: 0 20px">
        <el-tabs v-model="prettyActive">
            <el-tab-pane label="主题" name="theme"></el-tab-pane>
            <el-tab-pane label="插件" name="plugin"></el-tab-pane>
        </el-tabs>
    </div>
    <div id="container-main" class="pretty">
        <div class="body">
            <el-scrollbar>
                <theme-pretty v-if="prettyActive === 'theme'"></theme-pretty>
                <plugin-pretty v-else-if="prettyActive === 'plugin'"></plugin-pretty>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

import themePretty from "./components/theme.vue";
import pluginPretty from "./components/plugin.vue";

export default defineComponent({
    name: 'pretty',
    components: {themePretty, pluginPretty},
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