<template>
    <el-form :model="imageSetting" label-width="100px" style="width: 500px">
        <el-form-item label="图片类型:">
            <el-radio-group v-model="imageSetting.type">
                <el-radio :label="1">本地</el-radio>
                <el-radio :label="2" disabled>七牛云</el-radio>
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
            <el-select v-model="imageSetting.qiNiu.storageArea"
                       v-if="storageAreaSelect" placeholder="请选择存储区域"
            >
                <el-option label="华东" value="z0"/>
                <el-option label="华北" value="z1"/>
                <el-option label="华南" value="z2"/>
                <el-option label="北美" value="na0"/>
                <el-option label="东南亚" value="as0"/>
                <el-option label="华东-浙江2" value="cn-east-2"/>
            </el-select>
            <el-input v-model="imageSetting.qiNiu.storageArea" v-else style="width: 214px;"></el-input>
            <el-button type="primary" link @click="storageAreaSelect = !storageAreaSelect" style="margin-left: 20px;">
                切换
            </el-button>
        </el-form-item>
        <el-form-item label="网址后缀" v-if="imageSetting.type === 2">
            <el-input v-model="imageSetting.qiNiu.urlSuffix"></el-input>
        </el-form-item>
        <el-form-item label="存储路径" v-if="imageSetting.type === 2">
            <el-input v-model="imageSetting.qiNiu.storagePath"></el-input>
        </el-form-item>
        <el-form-item label="地址" v-if="imageSetting.type === 3">
            <el-input v-model="imageSetting.picGo.address"></el-input>
        </el-form-item>
        <el-form-item label="端口" v-if="imageSetting.type === 3">
            <el-input-number v-model="imageSetting.picGo.port" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {settingService} from "@/global/BeanFactory";
import {ElMessage} from "element-plus";

export default defineComponent({
    name: 'blog-setting',
    data: () => ({
        imageSetting: settingService.getImage(),
        storageAreaSelect: true
    }),
    methods: {
        save() {
            settingService.saveImage(this.imageSetting).then(() => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: '图片设置 - 保存成功'
                });
            }).catch(e => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '图片设置 - 保存失败，' + e
                });
            });
        }
    }
});
</script>
<style scoped>
</style>