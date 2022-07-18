<template>
    <el-form :model="blogSetting" label-width="100px" style="width: 500px">
        <el-form-item label="博客类型：">
            <el-radio-group v-model="blogSetting.type">
                <el-radio label="hexo">Hexo</el-radio>
                <!-- <el-radio label="vuePress">VuePress</el-radio> -->
            </el-radio-group>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { useLocalStorage } from '@vueuse/core';

export default defineComponent({
    setup() {
        const blogSetting = useLocalStorage('blogSetting', {
            type: 'hexo'
        });
        return {
            blogSetting
        }
    },
    name: 'blog-setting',
    methods: {
    }
});
</script>
<style scoped>
</style>