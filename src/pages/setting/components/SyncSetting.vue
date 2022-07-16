<template>
    <el-form :model="SyncSetting" label-width="120px" style="width: 600px;">
        <el-form-item label="平台：">
            <el-radio-group v-model="SyncSetting.platform">
                <el-radio label="1">Github Pages</el-radio>
                <el-radio label="2">GItee Pages</el-radio>
                <el-radio label="3">Coding Pages</el-radio>
                <el-radio label="4">Netlify</el-radio>
                <el-radio label="5">SFTP</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="域名：">
            <el-input v-model="SyncSetting.url" placeholder="请输入地址">
                <template #prepend>
                    <el-select v-model="SyncSetting.agreement" style="width: 90px">
                        <el-option label="https://" value="https://" />
                        <el-option label="http://" value="http://" />
                    </el-select>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="仓库名称：" v-if="contains(['1', '2', '3'], SyncSetting.platform)">
            <el-input v-model="SyncSetting.git.name"></el-input>
        </el-form-item>
        <el-form-item label="分支：" v-if="contains(['1', '2', '3'], SyncSetting.platform)">
            <el-input v-model="SyncSetting.git.branches" placeholder="master"></el-input>
        </el-form-item>
        <el-form-item label="仓库用户名：" v-if="contains(['1', '2', '3'], SyncSetting.platform)">
            <el-input v-model="SyncSetting.git.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" v-if="contains(['1', '2', '3'], SyncSetting.platform)">
            <el-input v-model="SyncSetting.git.email"></el-input>
        </el-form-item>
        <el-form-item label="令牌用户名："
            v-if="SyncSetting.platform === '3' && contains(['1', '2', '3'], SyncSetting.platform)">
            <el-input v-model="SyncSetting.coding.tokenUsername"></el-input>
        </el-form-item>
        <el-form-item label="令牌：" v-if="contains(['1', '2', '3'], SyncSetting.platform)">
            <el-input v-model="SyncSetting.git.token" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="CNAME：" v-if="contains(['1', '2', '3'], SyncSetting.platform)">
            <el-input v-model="SyncSetting.git.cname"></el-input>
        </el-form-item>
        <el-form-item label="Site ID：" v-if="contains(['4'], SyncSetting.platform)">
            <el-input v-model="SyncSetting.netlify.siteId"></el-input>
        </el-form-item>
        <el-form-item label="Access Token：" v-if="contains(['4'], SyncSetting.platform)">
            <el-input v-model="SyncSetting.netlify.accessToken"></el-input>
        </el-form-item>
        <el-form-item label="HTTP代理：" v-if="contains(['1', '2', '3', '4'], SyncSetting.platform)">
            <el-radio-group v-model="SyncSetting.proxy.type">
                <el-radio label="1">直连</el-radio>
                <el-radio label="2">代理</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="地址："
            v-if="SyncSetting.proxy.type === '2' && contains(['1', '2', '3', '4'], SyncSetting.platform)">
            <el-input v-model="SyncSetting.proxy.path"></el-input>
        </el-form-item>
        <el-form-item label="端口："
            v-if="SyncSetting.proxy.type === '2' && contains(['1', '2', '3', '4'], SyncSetting.platform)">
            <el-input-number v-model="SyncSetting.proxy.port" :precision="1" :max="65525" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary">保存</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'sync-setting',
    data: () => ({
        SyncSetting: {
            platform: "1",
            agreement: 'https://',
            url: '',
            git: {
                name: '',
                branches: '',
                username: '',
                email: '',
                token: '',
                cname: '',
            },
            coding: {
                tokenUsername: '',
            },
            proxy: {
                type: '1',
                path: '',
                port: 0
            },
            netlify: {
                siteId: '',
                accessToken: ''
            }
        }
    }),
    methods: {
        contains(arr: Array<string>, key: string) {
            for (let item of arr) {
                if (item === key) {
                    return true;
                }
            }
            return false;
        }
    }
});
</script>
<style scoped>
</style>