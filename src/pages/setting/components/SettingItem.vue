<template>
    <!-- 设置面板中的每一项 -->
    <div class="setting-item">
        <slot/>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: 'setting-item',
    data: () => ({})
});
</script>
<style scoped lang="less">
.setting-item {
    width: 480px;
    padding: 10px 10px;
    cursor: pointer;

    &:hover {
        background-color: #f2f2f2;
    }
}
</style>