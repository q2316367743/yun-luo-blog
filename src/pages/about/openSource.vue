<template>
</template>
<script lang="ts">
import { defineComponent } from "vue";

interface OpenSource {

    /**
     * 开源项目名称
     */
    name: string,

    /**
     * 主页、项目地址
     */
    homepage: string,

    /**
     * 开源许可证
     */
    license: string

}

export default defineComponent({
    name: 'tool-about-open-source',
    data: () => ({
        openSourceList: [{
            name: 'element-plus',
            homepage: 'https://github.com/element-plus/element-plus',
            license: 'https://github.com/element-plus/element-plus/blob/dev/LICENSE'
        }] as Array<OpenSource>
    })
});
</script>
<style scoped>

</style>