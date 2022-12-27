<template>
    <container-header>
        <el-page-header title="工具" content="环境管理" @back="goBack" style="margin-top: 8px;"/>
    </container-header>
    <container-main>
        <el-table :data="environments" height="calc(100%)">
            <el-table-column type="expand">
                <template #default="scope">
                    <el-descriptions :title="scope.row.name" :column="1" style="padding: 36px" border>
                        <el-descriptions-item label="node文件路径" width="200px">{{
                                scope.row.nodePath
                            }}
                        </el-descriptions-item>
                        <el-descriptions-item label="npm文件路径" width="200px">{{
                                scope.row.npmPath
                            }}
                        </el-descriptions-item>
                        <el-descriptions-item label="hexo文件路径" width="200px">{{
                                scope.row.hexoPath
                            }}
                        </el-descriptions-item>
                        <el-descriptions-item label="git文件路径" width="200px">{{
                                scope.row.gitPath
                            }}
                        </el-descriptions-item>
                        <el-descriptions-item label="npm镜像" width="200px">{{
                                scope.row.npmMirror
                            }}
                        </el-descriptions-item>
                    </el-descriptions>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="ID" width="180"/>
            <el-table-column prop="name" label="名称"/>
            <el-table-column label="操作" width="180">
                <template #header>
                    <div style="width: 100%;text-align: right;">
                        <el-button type="primary" @click="openDialog()">新增</el-button>
                    </div>
                </template>
                <template #default="scope">
                    <el-button @click="openDialog(scope.row)">修改</el-button>
                    <el-popconfirm title="确定删除此环境？删除后将无法恢复！" @confirm="removeById(scope.row.id)"
                                   confirm-button-text="删除" cancel-button-text="取消" confirm-button-type="danger">
                        <template #reference>
                            <el-button type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </container-main>
    <el-dialog v-model="showDialog" :title="isSave ? '新增环境' : '修改环境'" :close-on-click-modal="false">
        <el-form :model="environment" label-width="120px" style="width: 500px" ref="environmentInfo"
                 :rules="environmentRules" status-icon>
            <el-form-item prop="name" label="环境名称">
                <el-input v-model="environment.name"/>
            </el-form-item>
            <el-form-item prop="nodePath" label="node文件路径">
                <el-input v-model="environment.nodePath">
                    <template #append>
                        <el-button :icon="folder" @click="openNodeDialog"/>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="npmPath" label="npm文件路径">
                <el-input v-model="environment.npmPath">
                    <template #append>
                        <el-button :icon="folder" @click="openNpmDialog"/>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="hexoPath" label="hexo文件路径">
                <el-input v-model="environment.hexoPath">
                    <template #append>
                        <el-button :icon="folder" @click="openHexoDialog"/>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="gitPath" label="git文件路径">
                <el-input v-model="environment.gitPath">
                    <template #append>
                        <el-button :icon="folder" @click="openGitDialog"/>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="npm镜像">
                <el-input v-model="environment.npmMirror" placeholder="如不熟悉请勿更改"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save" v-if="isSave">保存</el-button>
                <el-button type="primary" @click="update" v-else>修改</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {ElMessage, FormInstance} from "element-plus";
import {Folder} from "@element-plus/icons-vue";

import DialogApi from "@/api/DialogApi";
import {environmentService} from "@/global/BeanFactory";
import Environment from "@/entities/Environment";

import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";

export default defineComponent({
    name: 'tool-environment',
    components: {ContainerMain, ContainerHeader},
    data: () => ({
        folder: markRaw(Folder),
        environmentId: environmentService.getId(),
        environment: {
            id: new Date().getTime(),
            name: '',
            nodePath: '',
            npmPath: '',
            hexoPath: '',
            gitPath: '',
            npmMirror: 'https://registry.npmmirror.com'
        } as Environment,
        environments: new Array<Environment>(),
        environmentRules: {
            name: [
                {required: true, message: '请输入环境名称', trigger: 'blur'},
            ],
            nodePath: [
                {required: true, message: '请选择node程序位置', trigger: 'blur'},
            ],
            npmPath: [
                {required: true, message: '请选择npm程序位置', trigger: 'blur'},
            ],
            hexoPath: [
                {required: true, message: '请选择hexo程序位置', trigger: 'blur'},
            ],
            gitPath: [
                {required: true, message: '请选择git程序位置', trigger: 'blur'},
            ],
        },
        showDialog: false,
        isSave: true,
    }),
    created() {
        this.initEnvironment();
    },
    methods: {
        goBack() {
            this.$router.push('/tool');
        },
        initEnvironment() {
            // 获取全部环境信息
            this.environments = environmentService.list()
            // 获取当前环境ID
            this.environmentId = environmentService.getId();
        },
        async openNodeDialog() {
            const selected = await DialogApi.open({
                title: '请选择node文件路径',
                multiple: true,
                defaultPath: 'C:\\Program Files',
                filters: [{
                    name: 'Application',
                    extensions: ['exe']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.environment.nodePath = (selected as string[])[0];
            }
        },
        async openNpmDialog() {
            const selected = await DialogApi.open({
                title: '请选择npm文件路径',
                multiple: true,
                defaultPath: this.environment.nodePath === '' ? 'C:\\Program Files' : this.environment.nodePath,
                filters: [{
                    name: 'Application',
                    extensions: ['cmd', 'sh']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.environment.npmPath = (selected as string[])[0];
            }
        },
        async openHexoDialog() {
            const selected = await DialogApi.open({
                title: '请选择hexo文件路径',
                multiple: true,
                defaultPath: this.environment.nodePath === '' ? 'C:\\Program Files' : this.environment.nodePath,
                filters: [{
                    name: 'Application',
                    extensions: ['cmd', 'sh']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.environment.hexoPath = (selected as string[])[0];
            }
        },
        async openGitDialog() {
            const selected = await DialogApi.open({
                title: '请选择git文件路径',
                multiple: true,
                defaultPath: 'C:\\Program Files',
                filters: [{
                    name: 'Application',
                    extensions: ['exe']
                }]
            });
            if (typeof selected === 'object' && selected) {
                this.environment.gitPath = (selected as string[])[0];
            }
        },
        openDialog(environment?: Environment) {
            if (environment) {
                this.environment = environment;
                this.isSave = false;
            } else {
                this.environment = {
                    id: new Date().getTime(),
                    name: '',
                    nodePath: '',
                    npmPath: '',
                    hexoPath: '',
                    gitPath: '',
                    npmMirror: 'https://registry.npmmirror.com'
                };
                this.isSave = true;
            }
            this.showDialog = true
        },
        save() {
            let environmentInfo = this.$refs.environmentInfo as FormInstance;
            if (!environmentInfo) return
            environmentInfo.validate((valid) => {
                if (valid) {
                    environmentService.add(this.environment).then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '环境设置 - 保存成功'
                        });
                        this.showDialog = false;
                        this.initEnvironment();
                    }).catch(e => {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '环境设置 - 保存失败，' + e
                        });
                    });
                }
            });
        },
        update() {
            let environmentInfo = this.$refs.environmentInfo as FormInstance;
            if (!environmentInfo) return
            environmentInfo.validate((valid) => {
                if (valid) {
                    environmentService.update(this.environment).then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '环境设置 - 修改成功'
                        });
                        this.showDialog = false;
                        this.initEnvironment();
                    }).catch(e => {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '环境设置 - 修改失败，' + e
                        });
                    });
                }
            });
        },
        removeById(id: number) {
            environmentService.remove(id).then(() => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: '环境设置 - 删除成功'
                });
                this.showDialog = false;
                this.initEnvironment();
            }).catch(e => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '环境设置 - 删除失败，' + e
                });
            });
        }
    }
});
</script>
<style scoped>
</style>