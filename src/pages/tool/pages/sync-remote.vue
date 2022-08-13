<template>
    <container-header>
        <el-page-header title="工具" content="远程同步" @back="goBack" style="margin-top: 8px;"/>
    </container-header>
    <container-main style="padding: 16px">
        <el-form label-width="120px">
            <el-form-item label="平台：">
                <el-radio-group v-model="SyncSetting.platform">
                    <el-radio label="1">未设置</el-radio>
                    <el-radio label="2">Github Pages</el-radio>
                    <el-radio label="3">Gitee Pages</el-radio>
                    <el-radio label="4">Coding Pages</el-radio>
                    <el-radio label="5">Netlify</el-radio>
                    <el-radio label="6">SFTP</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="域名：" v-if="SyncSetting.platform !== '1'">
                <el-input v-model="SyncSetting.url" placeholder="请输入地址" style="width: 400px">
                    <template #prepend>
                        <el-select v-model="SyncSetting.agreement" style="width: 90px">
                            <el-option label="https://" value="https://"/>
                            <el-option label="http://" value="http://"/>
                        </el-select>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="仓库名称：" v-if="contains(['2', '3', '4'], SyncSetting.platform)">
                <el-input v-model="SyncSetting.git.name" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="分支：" v-if="contains(['2', '3', '4'], SyncSetting.platform)">
                <el-input v-model="SyncSetting.git.branches" placeholder="master" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="仓库用户名：" v-if="contains(['2', '3', '4'], SyncSetting.platform)">
                <el-input v-model="SyncSetting.git.username" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" v-if="contains(['2', '3', '4'], SyncSetting.platform)">
                <el-input v-model="SyncSetting.git.email" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="令牌用户名："
                          v-if="SyncSetting.platform === '3' && contains(['2', '3', '4'], SyncSetting.platform)">
                <el-input v-model="SyncSetting.coding.tokenUsername" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="令牌：" v-if="contains(['2', '3', '4'], SyncSetting.platform)">
                <el-input v-model="SyncSetting.git.token" type="password" show-password style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="CNAME：" v-if="contains(['2', '3', '4'], SyncSetting.platform)">
                <el-input v-model="SyncSetting.git.cname" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="Site ID：" v-if="contains(['5'], SyncSetting.platform)">
                <el-input v-model="SyncSetting.netlify.siteId" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="Access Token：" v-if="contains(['5'], SyncSetting.platform)">
                <el-input v-model="SyncSetting.netlify.accessToken" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="HTTP代理：" v-if="contains(['2', '3', '4', '5'], SyncSetting.platform)">
                <el-radio-group v-model="SyncSetting.proxy.type" style="width: 400px">
                    <el-radio label="1">直连</el-radio>
                    <el-radio label="2">代理</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="地址："
                          v-if="SyncSetting.proxy.type === '2' && contains(['2', '3', '4', '5'], SyncSetting.platform)">
                <el-input v-model="SyncSetting.proxy.path" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="端口："
                          v-if="SyncSetting.proxy.type === '2' && contains(['2', '3', '4', '5'], SyncSetting.platform)">
                <el-input-number v-model="SyncSetting.proxy.port" :precision="1" :max="65525" style="width: 400px"/>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button>测试</el-button>
        </div>
    </container-main>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";
import {useSettingStore} from "@/store/SettingStore";
import ArrayUtil from "@/utils/ArrayUtil";

export default defineComponent({
    name: 'tool-sync-remote',
    components: {ContainerMain, ContainerHeader},
    data: () => ({
        SyncSetting: useSettingStore().syncSetting
    }),
    methods: {
        contains: ArrayUtil.contains,
        goBack() {
            this.$router.push('/tool');
        },
    }
});
</script>
<style scoped>
.footer {
    position: absolute;
    left: 0;
    right: 16px;
    bottom: 16px;
    display: flex;
    justify-content: right;
}
</style>