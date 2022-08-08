<template>
    <div id="pretty-plugin">
        <div v-if="blogIsInit">全部插件</div>
        <el-empty v-else description="博客尚未初始化，请先初始化后重试"/>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import blogStrategyContext from "@/strategy/blog/BlogStrategyContext";

export default defineComponent({
    name: 'pretty-plugin',
    data: () => ({
        blogIsInit: false
    }),
    created() {
        blogStrategyContext.getStrategy().isInit().then(isInit => {
            this.blogIsInit = isInit;
        });
    }
});
</script>
<style scoped lang="less">
#pretty-plugin {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>