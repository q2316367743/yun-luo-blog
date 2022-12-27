<template>
    <div id="container-header">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: 'container-header',
    data: () => ({})
});
</script>
<style lang="less">
#container-header {
    background-color: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    height: 40px;
    z-index: 2;
    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
    border-radius: 4px;
    max-width: calc(100% - 282px - 16px - 16px - 8px - 16px);
    line-height: 40px;
    padding: 0 12px;

    & > .el-button {
        margin: 5px;
        height: 32px;
    }
}
</style>