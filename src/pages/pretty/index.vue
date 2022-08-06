<template>
    <div id="pretty">
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
</template>
<script lang="ts">
import { defineComponent } from "vue";

import themePretty from "./components/theme.vue";
import pluginPretty from "./components/plugin.vue";

export default defineComponent({
    name: 'pretty',
    components: { themePretty, pluginPretty },
    data: () => ({
        prettyActive: 'theme'
    }),
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