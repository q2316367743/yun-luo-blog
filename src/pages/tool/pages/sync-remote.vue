<template>
    <container-header>
        <el-page-header title="工具" content="远程同步" @back="goBack" style="margin-top: 8px;"/>
    </container-header>
    <container-main style="padding: 16px">
        <el-form label-width="80px">
            <el-form-item label="同步类型">
                <el-radio-group v-model="syncRemoteSetting.type">
                    <el-radio :label="1">未设置</el-radio>
                    <el-radio :label="2">sftp</el-radio>
                    <el-radio :label="3">ZIP</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <el-form :model="syncRemoteSetting.sftp" label-width="80px" v-if="syncRemoteSetting.type === 2"
                 :rules="sftpRules" status-icon ref="sftpForm">
            <el-form-item label="服务器" prop="server">
                <el-input v-model="syncRemoteSetting.sftp.server"/>
            </el-form-item>
            <el-form-item label="端口" prop="port">
                <el-input-number v-model="syncRemoteSetting.sftp.port" :min="1" :step="1" :max="65535"
                                 controls-position="right"/>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="syncRemoteSetting.sftp.username"/>
            </el-form-item>
            <el-form-item label="链接类型">
                <el-radio-group v-model="syncRemoteSetting.sftp.connectType">
                    <el-radio :label="1">密码</el-radio>
                    <el-radio :label="2">SSH Key</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="密码" v-if="syncRemoteSetting.sftp.connectType === 1" prop="password">
                <el-input type="password" show-password v-model="syncRemoteSetting.sftp.password"/>
            </el-form-item>
            <el-form-item label="ssh私钥" v-else-if="syncRemoteSetting.sftp.connectType === 2" prop="privateKey">
                <el-input v-model="syncRemoteSetting.sftp.privateKey">
                    <template #append>
                        <el-button :icon="folder" @click="openPrivateKeyDialog"/>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="远程地址" prop="remoteDir">
                <el-input v-model="syncRemoteSetting.sftp.remoteDir"/>
            </el-form-item>
        </el-form>
        <el-form :model="syncRemoteSetting.zip" label-width="80px" v-if="syncRemoteSetting.type === 3"
                 :rules="zipRules" status-icon ref="zipForm">
            <el-form-item label="压缩包存放位置" prop="dir">
                <el-input v-model="syncRemoteSetting.zip.dir" placeholder="请选择压缩包存放位置"></el-input>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button @click="validation" v-if="syncRemoteSetting.type === 2">测试</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </container-main>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";
import ArrayUtil from "@/utils/ArrayUtil";
import {settingService} from "@/global/BeanFactory";
import {FormRules, FormInstance, ElMessage} from "element-plus";
import {Folder} from "@element-plus/icons-vue";
import DialogApi from "@/api/DialogApi";
import SftpApi from "@/api/SftpApi";

export default defineComponent({
    name: 'tool-sync-remote',
    setup() {
        const folder = markRaw(Folder);
        return {
            folder
        }
    },
    components: {ContainerMain, ContainerHeader},
    data: () => ({
        syncRemoteSetting: {
            type: 1,
            sftp: {
                server: '',
                port: 22,
                username: '',
                connectType: 1,
                password: '',
                privateKey: '',
                remoteDir: ''
            },
            zip: {
                dir: ''
            }
        },
        sftpRules: {
            server: [
                {required: true, message: '请输入服务器地址', trigger: 'blur'},
            ],
            port: [
                {required: true, message: "请输入服务器端口号", trigger: 'blur'},
                {type: 'number', min: 1, max: 65535, defaultField: 22, message: "请输入正确的端口号", trigger: 'blur'}
            ],
            username: [
                {required: true, message: '请输入用户名', trigger: 'blur'},
            ],
            password: [
                {required: true, message: '请输入密码', trigger: 'blur'},
            ],
            privateKey: [
                {required: true, message: '请输入私钥地址', trigger: 'blur'},
            ],
            remoteDir: [
                {required: true, message: '请输入远程地址', trigger: 'blur'},
            ],
        } as FormRules,
        zipRules: {
            dir: [
                {required: true, message: '请输入压缩包存放位置', trigger: 'blur'},
            ],
        }
    }),
    created() {
        this.syncRemoteSetting = settingService.getSyncRemote();
    },
    methods: {
        contains: ArrayUtil.contains,
        goBack() {
            this.$router.push('/tool');
        },
        async openPrivateKeyDialog() {
            const selected = await DialogApi.open({
                title: '请选择SSH Key文件路径',
                multiple: true,
                defaultPath: 'C:\\Users',
                filters: [{
                    name: '*',
                    extensions: ['*']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.syncRemoteSetting.sftp.privateKey = (selected)[0];
            }
        },
        async testForSftp() {
            let sftpForm = this.$refs.sftpForm as FormInstance;
            if (!sftpForm) return
            await sftpForm.validate((valid) => {
                if (valid) {
                    return Promise.resolve();
                } else {
                    return Promise.reject('字段验证错误');
                }
            })
        },
        async testForZip() {
            let zipForm = this.$refs.zipForm as FormInstance;
            if (!zipForm) return
            await zipForm.validate((valid) => {
                if (valid) {
                    return Promise.resolve();
                } else {
                    return Promise.reject('字段验证错误');
                }
            })
        },
        validationForSftp() {
            this.testForSftp().then(() => {
                SftpApi.test(this.syncRemoteSetting.sftp).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: '测试连接成功'
                    })
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '测试连接失败，' + e
                    })
                })
                console.log('验证成功')
            }).catch((e) => {
                console.log(e)
            })
        },
        saveForSftp() {
            this.testForSftp().then(() => {
                SftpApi.test(this.syncRemoteSetting.sftp).then(() => {
                    settingService.saveSyncRemote(this.syncRemoteSetting).then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '数据保存成功'
                        })
                    }).catch(e => {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '数据保存失败，' + e
                        })
                    });
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '测试连接失败，' + e
                    });
                })
            }).catch(() => {
                console.log('验证失败')
            })
        },
        saveForZip() {
            this.testForZip().then(() => {
                settingService.saveSyncRemote(this.syncRemoteSetting).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: '数据保存成功'
                    })
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '数据保存失败，' + e
                    })
                });
            }).catch(() => {
                console.log('验证失败')
            });
        },
        validation() {
            switch (this.syncRemoteSetting.type) {
                case 2:
                    this.validationForSftp();
                    break;
            }
        },
        save() {
            switch (this.syncRemoteSetting.type) {
                case 2:
                    this.saveForSftp();
                    break;
                case 3:
                    this.saveForZip();
                    break;
            }
        }
    }
});
</script>
<style scoped lang="less">
.el-form {
    .el-input {
        width: 400px;
    }
}

.footer {
    position: absolute;
    left: 0;
    right: 16px;
    bottom: 16px;
    display: flex;
    justify-content: right;
}
</style>