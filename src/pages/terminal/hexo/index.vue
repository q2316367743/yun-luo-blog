<template>
    <div style="display: flex;justify-content: space-between">
        <el-button-group>
            <el-button :disabled="initDisable" @click="init">初始化</el-button>
            <el-button :disabled="installDisable || !blogIsInit" @click="install">依赖安装</el-button>
            <el-button :disabled="serverDisable || !blogIsInit" @click="server">运行</el-button>
            <el-button :disabled="deployDisable || !blogIsInit" @click="deploy">部署</el-button>
            <el-button :disabled="cleanDisable || !blogIsInit" @click="clean">清理</el-button>
        </el-button-group>
        <div>
            <el-button type="danger" @click="clearStack">清空</el-button>
        </div>
    </div>
    <div id="terminal-hexo" style="margin-top: 20px;">
        <el-empty description="还没有任务..." v-if="terminalStacks.length === 0"></el-empty>
        <div v-else>
            <el-timeline>
                <el-timeline-item :timestamp="formatDateTime(terminalStack.time)" placement="top"
                                  v-for="terminalStack of terminalStacks" :key="terminalStack.id">
                    <el-card>
                        <template #header>
                            <div style="display: flex;justify-content: space-between;">
                                <div>
                                    <span>{{ terminalStack.name }}</span>
                                    <el-tag style="margin-left: 5px;" type="success" v-if="terminalStack.success">
                                        执行成功
                                    </el-tag>
                                    <el-tag style="margin-left: 5px;" type="danger" v-else>执行失败</el-tag>
                                    <el-tag style="margin-left: 5px;" v-if="terminalStack.run">运行中</el-tag>
                                    <el-tag style="margin-left: 5px;" type="danger"
                                            v-if="!terminalStack.run && terminalStack.success">已停止
                                    </el-tag>
                                </div>
                                <el-button class="button" text v-if="terminalStack.run" @click="kill(terminalStack.id)">
                                    停止
                                </el-button>
                            </div>
                        </template>
                        <el-divider content-position="center" @click="terminalStack.show = !terminalStack.show">
                            <span style="cursor:pointer;user-select: none;">展示/隐藏</span>
                        </el-divider>
                        <div v-if="terminalStack.show">
                            <el-scrollbar max-height="200px">
                                <div class="terminal-list">
                                    <p class="terminal-line" v-for="line in terminalStack.contents" v-html="line"></p>
                                </div>
                            </el-scrollbar>
                        </div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import DateUtil from "@/utils/DateUtil";
import {ElMessage} from "element-plus";
import TerminalStack from "@/entities/TerminalStack";
import Constant from "@/global/Constant";
import blogStrategyContext from "@/strategy/blog/BlogStrategyContext";
import {settingService, terminalService} from "@/global/BeanFactory";

export default defineComponent({
    name: 'terminal-hexo',
    data: () => ({
        terminalService: terminalService,
        blogIsInit: true,
        initDisable: false,
        serverDisable: false,
        deployDisable: false,
        cleanDisable: false,
        installDisable: false
    }),
    computed: {
        terminalStacks(): Array<TerminalStack> {
            let terminalStackValues = this.terminalService.getTerminalStackMap().values();
            let terminalStacks = new Array<TerminalStack>();
            for (let item of terminalStackValues) {
                terminalStacks.push(item);
            }
            return terminalStacks.sort((e1, e2) => {
                return e2.time.getTime() - e1.time.getTime()
            });
        },
    },
    watch: {
        terminalStacks: {
            handler(value: Array<TerminalStack>) {
                for (let terminalStack of value) {
                    if (terminalStack.run && terminalStack.success) {
                        if (terminalStack.command === Constant.HEXO.INIT) {
                            this.initDisable = true
                        } else if (terminalStack.command === Constant.HEXO.INSTALL) {
                            this.installDisable = true
                        } else if (terminalStack.command === Constant.HEXO.CLEAN) {
                            this.cleanDisable = true
                        } else if (terminalStack.command === Constant.HEXO.SERVER) {
                            this.serverDisable = true
                        } else if (terminalStack.command === Constant.HEXO.DEPLOY) {
                            this.deployDisable = true
                        }
                    } else {
                        if (terminalStack.command === Constant.HEXO.INIT) {
                            this.initDisable = false
                            this.blogIsInit = true;
                        } else if (terminalStack.command === Constant.HEXO.INSTALL) {
                            this.cleanDisable = false
                        } else if (terminalStack.command === Constant.HEXO.CLEAN) {
                            this.cleanDisable = false
                        } else if (terminalStack.command === Constant.HEXO.SERVER) {
                            this.serverDisable = false
                        } else if (terminalStack.command === Constant.HEXO.DEPLOY) {
                            this.deployDisable = false
                        }
                    }
                }
            },
            deep: true
        }
    },
    created() {
        for (let terminalStack of this.terminalStacks) {
            if (terminalStack.run && terminalStack.success) {
                if (terminalStack.command === Constant.HEXO.INIT) {
                    this.initDisable = true
                } else if (terminalStack.command === Constant.HEXO.INSTALL) {
                    this.installDisable = true
                } else if (terminalStack.command === Constant.HEXO.CLEAN) {
                    this.cleanDisable = true
                } else if (terminalStack.command === Constant.HEXO.SERVER) {
                    this.serverDisable = true
                } else if (terminalStack.command === Constant.HEXO.DEPLOY) {
                    this.deployDisable = true
                }
            } else {
                if (terminalStack.command === Constant.HEXO.INIT) {
                    this.initDisable = false
                } else if (terminalStack.command === Constant.HEXO.INSTALL) {
                    this.installDisable = false
                } else if (terminalStack.command === Constant.HEXO.CLEAN) {
                    this.cleanDisable = false
                } else if (terminalStack.command === Constant.HEXO.SERVER) {
                    this.serverDisable = false
                } else if (terminalStack.command === Constant.HEXO.DEPLOY) {
                    this.deployDisable = false
                }
            }
        }
        blogStrategyContext.getStrategy().isInit().then(isInit => {
            this.blogIsInit = isInit;
        })
    },
    methods: {
        formatDateTime: DateUtil.formatDateTime,
        kill(id: number) {
            this.terminalService.kill(id);
        },
        init() {
            this.runCommand('初始化', Constant.HEXO.INIT);
        },
        server() {
            this.runCommand('运行', Constant.HEXO.SERVER);
        },
        deploy() {
            this.runCommand('部署', Constant.HEXO.DEPLOY);
        },
        clean() {
            this.runCommand('清理', Constant.HEXO.CLEAN);
        },
        install() {
            this.runCommand('安装', Constant.HEXO.INSTALL);
        },
        clearStack() {
            this.terminalService.clean();
        },
        async runCommand(name: string, args: string) {
            this.terminalService.add(name, {
                command: settingService.getEnvironment().hexoPath,
                currentDir: await Constant.FOLDER.HEXO.BASE(),
                args: args
            }).then(() => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: '命令执行成功'
                });
            }).catch(e => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '命令执行失败' + ',' + e
                });
            })
        }
    },
});
</script>
<style>
.terminal-list {
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    padding: 6px;
    background-color: #424251;
    margin-top: 10px;
    min-height: 30px;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: JetBrainsMono, serif;
}

.terminal-line {
    margin: 2px 0;
    padding: 0;
    box-sizing: border-box;
    outline: none !important;
    letter-spacing: 1px
}
</style>