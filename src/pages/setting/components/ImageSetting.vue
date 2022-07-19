<template>
    <el-form :model="imageSetting" label-width="100px" style="width: 500px">
        <el-form-item label="图片类型:">
            <el-radio-group v-model="imageSetting.type">
                <el-radio :label="1">本地</el-radio>
                <el-radio :label="2">七牛云</el-radio>
                <el-radio :label="3">PigGo</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="Access Key" v-if="imageSetting.type === 2">
            <el-input v-model="imageSetting.qiNiu.accessKey"></el-input>
        </el-form-item>
        <el-form-item label="Secret Key" v-if="imageSetting.type === 2">
            <el-input v-model="imageSetting.qiNiu.secretKey"></el-input>
        </el-form-item>
        <el-form-item label="存储空间名" v-if="imageSetting.type === 2">
            <el-input v-model="imageSetting.qiNiu.storageSpace"></el-input>
        </el-form-item>
        <el-form-item label="访问地址" v-if="imageSetting.type === 2">
            <el-input v-model="imageSetting.qiNiu.accessUrl"></el-input>
        </el-form-item>
        <el-form-item label="存储区域" v-if="imageSetting.type === 2">
            <el-select v-model="imageSetting.qiNiu.storageArea">
                <el-option label="华东" value="z0" />
                <el-option label="华北" value="z1" />
                <el-option label="华南" value="z2" />
                <el-option label="北美" value="na0" />
                <el-option label="东南亚" value="as0" />
                <el-option label="华东-浙江2" value="cn-east-2" />
            </el-select>
        </el-form-item>
        <el-form-item label="网址后缀" v-if="imageSetting.type === 2">
            <el-input v-model="imageSetting.qiNiu.urlSuffix"></el-input>
        </el-form-item>
        <el-form-item label="存储路径" v-if="imageSetting.type === 2">
            <el-input v-model="imageSetting.qiNiu.storagePath"></el-input>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useLocalStorage } from '@vueuse/core';

export default defineComponent({
    setup() {
        const imageSetting = useLocalStorage('imageSetting', {
            type: 1,
            qiNiu: {
                accessKey: '',
                secretKey: '',
                storageSpace: '',
                accessUrl: '',
                storageArea: '',
                urlSuffix: '',
                storagePath: ''
            }
        });
        return {
            imageSetting
        }
    },
    name: 'blog-setting',
    methods: {
    }
});
</script>
<style scoped>
</style>