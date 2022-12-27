<template>
    <div id="container-main">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: 'container-main',
    data: () => ({})
});
</script>
<style lang="less">
#container-main {
    background-color: #ffffff;
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
    border-radius: 4px;
}
</style>