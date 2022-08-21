<template>
    <div id="file-manage">
        <div class="file-menu">
            <el-scrollbar></el-scrollbar>
        </div>
        <div class="file-editor"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'file-manage',
    data: () => ({

    })
});
</script>
<style lang="less">
#file-manage {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .file-menu {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 200px;
        border-right: #eeeeee solid 1px;
    }
    .file-editor {
        position: absolute;
        top: 0;
        left: 200px;
        right: 0;
        bottom: 0;
    }
}
</style>