<template>
    <el-form :model="basicSetting" label-width="120px" style="width: 500px">
        <el-form-item label="站点源文件路径">
            <el-link href="#" @click="openFolder">{{basicSetting.path}}</el-link>
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
import { Folder } from "@element-plus/icons-vue";
import { documentDir } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/api/dialog';
import { open as openWindow } from '@tauri-apps/api/shell';

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
        openFolder() {
            openWindow(this.basicSetting.path)
        }
    }
});
</script>
<style scoped>
</style>