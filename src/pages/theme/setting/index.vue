<template>
    <div id="theme-setting">
        <monaco-editor language="yaml" v-model="content" height="100%"></monaco-editor>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import MonacoEditor from '@/components/MonacoEditor/index.vue';

export default defineComponent({
    name: 'theme-setting',
    components: {MonacoEditor},
    data: () => ({
        content: ''
    }),
    watch: {
        content() {
        }
    }
});
</script>
<style scoped lang="less">
#theme-setting {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px;
}
</style>