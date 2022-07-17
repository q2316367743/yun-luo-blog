<template>
    <el-form :model="basicSetting" label-width="120px" style="width: 500px">
        <el-form-item label="站点源文件路径">
            {{basicSetting.path}}
        </el-form-item>
        <el-form-item label="node文件路径">
            <el-input v-model="basicSetting.nodePath">
                <template #append>
                    <el-button :icon="folder" @click="openNodeDialog" />
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="npm文件路径">
            <el-input v-model="basicSetting.npmPath">
                <template #append>
                    <el-button :icon="folder" @click="openNpmDialog" />
                </template>
            </el-input>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { useLocalStorage } from '@vueuse/core';
import { documentDir } from '@tauri-apps/api/path';


import { Folder } from "@element-plus/icons-vue";
import { open } from '@tauri-apps/api/dialog';

export default defineComponent({
    setup() {
        const folder = markRaw(Folder);
        const basicSetting = useLocalStorage('basicSetting', {
            path: '',
            nodePath: '',
            npmPath: ''
        });
        documentDir().then(path => {
            basicSetting.value.path = path + 'cloud-fell-blog';
        })
        return {
            folder, basicSetting
        }
    },
    name: 'basic-setting',
    methods: {
        async openNodeDialog() {
            const selected = await open({
                title: '请选择node文件路径',
                multiple: true,
                filters: [{
                    name: 'Application',
                    extensions: ['exe']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.basicSetting.nodePath = (selected as string[])[0];
            }
        },
        async openNpmDialog() {
            const selected = await open({
                title: '请选择npm文件路径',
                multiple: true,
                filters: [{
                    name: 'Application',
                    extensions: ['cmd', 'sh']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.basicSetting.npmPath = (selected as string[])[0];
            }
        },
    }
});
</script>
<style scoped>
</style>