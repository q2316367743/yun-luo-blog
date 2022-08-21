<template>
    <div id="pretty-plugin">
        <div class="option">
            <el-input v-model="keyword" clearable style="width: 400px" @input="search"></el-input>
        </div>
        <el-scrollbar v-if="blogIsInit" class="view">
            <el-row>
                <el-col :span="24" style="margin-bottom: 10px" v-for="dependency in dependenciesTemp"
                        :key="dependency.name">
                    <el-card shadow="hover">
                        <div class="plugin-card">
                            <div>
                                <span>{{ dependency.name }}</span>
                                <el-tag style="margin-left: 10px;">{{ dependency.version }}</el-tag>
                            </div>
                            <div>
                                <el-button type="danger" link @click="uninstall(dependency.name)">删除</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-scrollbar>
        <el-empty v-else :description="$t('hint.blog_not_init')"/>
        <div class="plugin-add" v-if="blogIsInit">
            <el-button type="primary" circle :icon="plus" @click="openPluginAddDialog"></el-button>
        </div>
        <el-dialog v-model="pluginAddDialog" title="新增插件" draggable top="25vh">
            <el-form v-model="plugin" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="plugin.name"></el-input>
                </el-form-item>
                <el-form-item label="版本">
                    <el-input v-model="plugin.version" placeholder="选填"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="pluginAddDialog = false">取消</el-button>
                <el-button type="primary" @click="install">安装</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Edit, Plus} from "@element-plus/icons-vue";
import blogStrategyContext from "@/strategy/blog/BlogStrategyContext";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import {ElLoading, ElMessage, ElMessageBox} from "element-plus";
import NativeApi from "@/api/NativeApi";
import {settingService} from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

/**
 * 依赖
 */
interface Dependency {

    /**
     * 依赖名称
     */
    name: string;

    /**
     * 版本
     */
    version: string;

}

export default defineComponent({
    name: 'pretty-plugin',
    setup() {
        const plus = markRaw(Plus);
        const edit = markRaw(Edit);
        return {plus, edit}
    },
    data: () => ({
        blogIsInit: false,
        pluginAddDialog: false,
        dependencies: new Array<Dependency>(),
        dependenciesTemp: new Array<Dependency>(),
        plugin: {
            name: "",
            version: ""
        },
        keyword: ''
    }),
    created() {
        blogStrategyContext.getStrategy().isInit().then(isInit => {
            this.blogIsInit = isInit;
            // 读取package.json文件
            if (isInit) {
                this.listPlugin();
            }
        });
    },
    methods: {
        listPlugin() {
            Constant.FOLDER.HEXO.PACKAGE_JSON().then(path => {
                FileApi.readFile(path).then(content => {
                    let packageJson = JSON.parse(content);
                    this.dependencies = [];
                    // 解析dependencies
                    try {
                        if (packageJson.dependencies) {
                            for (let dependency of Object.keys(packageJson.dependencies)) {
                                this.dependencies.push({
                                    name: dependency,
                                    version: packageJson.dependencies[dependency]
                                });
                            }
                        }
                    } catch (e) {
                        console.log(e);
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '解析dependencies失败,' + e
                        });
                    }
                    try {
                        if (packageJson.devDependencies) {
                            for (let dependency of Object.keys(packageJson.devDependencies)) {
                                this.dependencies.push({
                                    name: dependency,
                                    version: packageJson.dependencies[dependency]
                                });
                            }
                        }
                    } catch (e) {
                        console.log(e);
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '解析devDependencies失败,' + e
                        });
                    }
                    this.search();
                })
            })
        },
        search() {
            this.dependenciesTemp = this.dependencies.filter(e => e.name.includes(this.keyword));
        },
        openPluginAddDialog() {
            this.plugin = {
                name: "",
                version: ""
            }
            this.pluginAddDialog = true;
        },
        install() {
            // 检查明细
            if (this.plugin.name === "") {
                ElMessage({
                    showClose: true,
                    type: "error",
                    message: "请填写插件名称"
                });
                return;
            }
            // 检查git地址是否选择
            let environment = settingService.getEnvironment();
            if (environment.npmPath == "") {
                ElMessage({
                    showClose: true,
                    type: "error",
                    message: "请先在设置 -> 环境配置进行npm地址设置"
                });
                return;
            }
            Constant.FOLDER.HEXO.BASE().then(path => {
                let command = `install --save ${this.plugin.name}`;
                if (this.plugin.version !== "") {
                    command = command + "@" + this.plugin.version
                }
                if (environment.npmMirror && environment.npmMirror !== "") {
                    command = command + " --registry " + environment.npmMirror;
                }
                const loading = ElLoading.service({
                    lock: true,
                    text: '执行安装命令中',
                    background: 'rgba(0, 0, 0, 0.7)',
                });
                NativeApi.invokeSync(environment.npmPath,
                    path,
                    command
                ).then(() => {
                    emitter.emit(MessageEventEnum.CONFIG_UPDATE);
                    this.listPlugin();
                    ElMessage({
                        showClose: true,
                        type: "success",
                        message: "安装成功"
                    });
                    this.pluginAddDialog = false;
                    loading.close();
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: "error",
                        message: "安装命令执行失败，" + e
                    });
                    loading.close();
                })
            }).catch(e => {
                ElMessage({
                    showClose: true,
                    type: "error",
                    message: "异常，" + e
                });
            })
        },
        uninstall(plugin: string) {
            ElMessageBox.confirm(`确认删除插件【${plugin}】？`, "确认删除", {
                type: "warning",
                cancelButtonText: "取消",
                confirmButtonText: "删除"
            }).then(() => {
                // 检查git地址是否选择
                let environment = settingService.getEnvironment();
                if (environment.npmPath == "") {
                    ElMessage({
                        showClose: true,
                        type: "error",
                        message: "请先在设置 -> 环境配置进行npm地址设置"
                    });
                    return;
                }
                Constant.FOLDER.HEXO.BASE().then(path => {
                    const loading = ElLoading.service({
                        lock: true,
                        text: '执行删除命令中',
                        background: 'rgba(0, 0, 0, 0.7)',
                    });
                    NativeApi.invokeSync(environment.npmPath,
                        path,
                        `remove ${plugin}`
                    ).then(() => {
                        emitter.emit(MessageEventEnum.CONFIG_UPDATE);
                        this.listPlugin();
                        ElMessage({
                            showClose: true,
                            type: "success",
                            message: "删除成功"
                        });
                        this.pluginAddDialog = false;
                        loading.close();
                    }).catch(e => {
                        ElMessage({
                            showClose: true,
                            type: "error",
                            message: "删除命令执行失败，" + e
                        });
                        loading.close();
                    })
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: "error",
                        message: "异常，" + e
                    });
                })
            }).catch(() => {
            })
        }
    }
});
</script>
<style scoped lang="less">
#pretty-plugin {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .option {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 48px;
        padding-bottom: 8px;
    }

    .view {
        position: absolute;
        top: 48px;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .plugin-add {
        position: fixed;
        right: 120px;
        bottom: 42px;
    }

    .plugin-card {
        display: flex;
        justify-content: space-between;
    }
}
</style>