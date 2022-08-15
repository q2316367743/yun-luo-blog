<template>
    <section id="app">
        <aside id="side" :style="{width: isCollapse ? '64px' : '200px'}">
            <div id="logo" :style="{display: isCollapse ? 'block' : 'flex'}">
                <div v-if="!isCollapse">{{ $t('app.projectName') }}</div>
                <div style="text-align: center;padding: 3px;cursor: pointer" @click="isCollapse = !isCollapse">
                    <el-icon v-if="isCollapse">
                        <Expand/>
                    </el-icon>
                    <el-icon v-else>
                        <Fold/>
                    </el-icon>
                </div>
            </div>
            <el-menu :default-active="$route.path" router :collapse="isCollapse">
                <el-menu-item index="/post/list">
                    <el-icon>
                        <document/>
                    </el-icon>
                    <span>{{ $t('menu.post') }}</span>
                </el-menu-item>
                <el-menu-item index="/tag">
                    <el-icon>
                        <price-tag/>
                    </el-icon>
                    <span>{{ $t('menu.tag') }}</span>
                </el-menu-item>
                <el-menu-item index="/category">
                    <el-icon>
                        <collection-tag/>
                    </el-icon>
                    <span>{{ $t('menu.category') }}</span>
                </el-menu-item>
                <el-menu-item :index="`/pretty/${basicSetting.blogType}`">
                    <el-icon>
                        <shopping-cart-full></shopping-cart-full>
                    </el-icon>
                    <span>{{ $t('menu.pretty') }}</span>
                </el-menu-item>
                <el-menu-item :index="`/config/${basicSetting.blogType}`">
                    <el-icon>
                        <Menu/>
                    </el-icon>
                    <span>{{ $t('menu.blogSetting') }}</span>
                </el-menu-item>
                <el-menu-item index="/tool">
                    <el-icon>
                        <tools/>
                    </el-icon>
                    <span>{{ $t('menu.tool') }}</span>
                </el-menu-item>
            </el-menu>
        </aside>
        <section id="body">
            <header id="header">
                <div class="nav-bar">
                    <div class="left"></div>
                    <div class="navigation">
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            :content="$t('common.synchronous')"
                            placement="bottom"
                        >
                            <div class="nav-item" @click="sync">
                                <el-icon>
                                    <refresh/>
                                </el-icon>
                            </div>
                        </el-tooltip>
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            :content="$t('common.terminal')"
                            placement="bottom"
                        >
                            <div class="nav-item" @click="terminalDialog = true">
                                <el-icon :size="18">
                                    <terminal-box/>
                                </el-icon>
                            </div>
                        </el-tooltip>
                        <el-dropdown @command="changeI18n">
                            <div class="nav-item">
                                <el-icon :size="18">
                                    <translate/>
                                </el-icon>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="zhCn">{{ $t('app.chinese') }}</el-dropdown-item>
                                    <el-dropdown-item command="enUs">{{ $t('app.english') }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            :content="isDark ? $t('common.dark') : $t('common.light')"
                            placement="bottom"
                        >
                            <div class="nav-item">
                                <el-icon :size="18" @click="toggleDark">
                                    <sun v-if="!isDark"/>
                                    <moon v-else></moon>
                                </el-icon>
                            </div>
                        </el-tooltip>
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            :content="serverStatus"
                            placement="bottom"
                        >
                            <el-dropdown trigger="contextmenu" @command="serverOperation">
                                <div class="nav-item">
                                    <el-icon>
                                        <run v-if="server === 1" style="color: #67c23a;"/>
                                        <loader v-else-if="server === 2"/>
                                        <server v-else-if="server === 3"/>
                                    </el-icon>
                                </div>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item command="start" v-if="server === 3">
                                            {{ $t('app.serverStart') }}
                                        </el-dropdown-item>
                                        <el-dropdown-item command="stop" v-if="server === 1">
                                            {{ $t('app.serverStop') }}
                                        </el-dropdown-item>
                                        <el-dropdown-item command="dist">{{ $t('app.openDist') }}</el-dropdown-item>
                                        <el-dropdown-item command="browser" v-if="server === 1 || server === 2">
                                            {{ $t('app.openBrowser') }}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </el-tooltip>
                        <el-dropdown trigger="contextmenu" @command="settingOperation">
                            <div class="nav-item" @click="openSetting">
                                <el-icon>
                                    <setting/>
                                </el-icon>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="projectDir">
                                        {{ $t('app.openProjectDir') }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="devtools">
                                        {{ $t('app.openDevTools') }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>
            </header>
            <main id="container">
                <router-view></router-view>
            </main>
        </section>
        <el-drawer v-model="settingDialog" size="600px" :title="$t('common.setting')" destroy-on-close>
            <el-scrollbar>
                <setting-page></setting-page>
            </el-scrollbar>
        </el-drawer>
        <el-dialog v-model="terminalDialog" destroy-on-close draggable :title="$t('common.terminal')">
            <terminal-hexo-page v-if="basicSetting.blogType === 'hexo'"></terminal-hexo-page>
        </el-dialog>
    </section>
</template>

<!--suppress JSIncompatibleTypesComparison -->
<script lang='ts'>
import {defineComponent, markRaw} from 'vue'
import {
    ArrowDown,
    CollectionTag,
    Document,
    Expand,
    Fold,
    Folder,
    Menu,
    PriceTag,
    Refresh,
    Setting,
    ShoppingCartFull,
    Suitcase
} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from "element-plus";
import {useDark} from '@vueuse/core'

import Translate from "@/icon/Translate.vue";
import TerminalBox from "@/icon/TerminalBox.vue";
import Sun from "@/icon/Sun.vue";
import Moon from "@/icon/Moon.vue"
import Server from '@/icon/Server.vue';
import Run from '@/icon/Run.vue';
import Loader from '@/icon/Loader.vue';
import Tools from '@/icon/Tools.vue';
import Constant from "@/global/Constant";
import blogStrategyContext from "@/strategy/blog/BlogStrategyContext";
import NativeApi from "@/api/NativeApi";

import SettingPage from '@/pages/setting/index.vue';
import TerminalHexoPage from "@/pages/terminal/hexo/index.vue";
import {serverService, settingService} from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import ServerStatusEnum from "@/enumeration/ServerStatusEnum";
import ApplicationApi from "@/api/ApplicationApi";

export default defineComponent({
    components: {
        Document, ArrowDown, Setting, Refresh, PriceTag, Menu, CollectionTag,
        ShoppingCartFull, SettingPage, Expand, Fold, Suitcase, Tools,
        Translate, TerminalBox, Sun, Moon, TerminalHexoPage, Server, Run,
        Loader
    },
    setup() {
        const setting = markRaw(Setting);
        const folder = markRaw(Folder);
        return {
            setting, folder
        }
    },
    data: () => {
        return {
            basicSetting: settingService.getBasic(),
            defaultActive: '/post/list',
            settingDialog: false,
            terminalDialog: false,
            isCollapse: false,
            isDark: useDark({
                selector: 'html',
                attribute: 'class',
                valueDark: 'dark',
                valueLight: 'light',
            }),
            // 服务是否允许，true：运行中
            server: ServerStatusEnum.STOP as ServerStatusEnum,
            // 服务按钮是否禁用
            serverDisable: false
        }
    },
    created() {
        // 此处注册服务器事件
        emitter.on(MessageEventEnum.SERVER_START, () => {
            // 服务启动
            this.server = ServerStatusEnum.RUN;
            // 解除服务禁用
            this.serverDisable = false;
        });
        emitter.on(MessageEventEnum.SERVER_UPDATE_START, () => {
            // 服务更新开始
            this.server = ServerStatusEnum.UPDATE;
            // 更新中，服务禁用
            this.serverDisable = true;
        });
        emitter.on(MessageEventEnum.SERVER_UPDATE_COMPLETE, () => {
            // 解除服务禁用
            this.serverDisable = false;
            // 服务更新结束
            this.server = ServerStatusEnum.RUN;
        });
        emitter.on(MessageEventEnum.SERVER_STOP, () => {
            // 服务停止
            this.server = ServerStatusEnum.STOP;
            // 解除服务禁用
            this.serverDisable = false;
        });
    },
    computed: {
        serverStatus(): string {
            if (ServerStatusEnum.RUN === this.server) {
                return this.$t('app.serverRun')
            } else if (this.server === ServerStatusEnum.UPDATE) {
                return this.$t('app.serverUpdate');
            } else if (this.server === ServerStatusEnum.STOP) {
                return this.$t('app.serverStandby');
            } else {
                return this.$t('app.serverUnknown');
            }
        }
    },
    methods: {
        sync() {
            blogStrategyContext.getStrategy().sync().then(() => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: this.$t('app.syncSuccess')
                });
            }).catch(e => {
                ElMessageBox.alert(e, this.$t('app.syncFail'), {
                    confirmButtonText: this.$t('common.confirm'),
                    type: "error",
                    draggable: true
                });
            })
        },
        openSetting() {
            this.settingDialog = true;
        },
        runServer() {
            // 只有服务没有禁用中，才可以点击
            if (!this.serverDisable) {
                // 服务禁用
                this.serverDisable = true;
                // 服务已停止，服务运行
                serverService.start().then(() => {
                    ElMessage({
                        showClose: true,
                        type: "success",
                        message: "运行成功"
                    });
                }).catch(e => {
                    console.error(e);
                    ElMessage({
                        showClose: true,
                        type: "error",
                        message: "运行失败" + ',' + e
                    });
                });
            }
        },
        stopServer() {
            // 只有服务没有禁用中，才可以点击
            if (!this.serverDisable) {
                // 服务禁用
                this.serverDisable = true;
                // 服务正在运行中，停止服务
                serverService.stop().then(() => {
                    ElMessage({
                        showClose: true,
                        type: "success",
                        message: "停止运行"
                    });
                }).catch(e => {
                    if (e) {
                        console.error(e);
                        ElMessage({
                            showClose: true,
                            type: "error",
                            message: "停止运行失败" + ',' + e
                        });
                    }
                });
            }
        },
        openFolder() {
            Constant.FOLDER.POST().then(path => {
                NativeApi.openFolder(path);
            })
        },
        toggleDark() {
            this.isDark = !this.isDark;
        },
        changeI18n(language: string) {
            this.$i18n.locale = language;
            this.basicSetting.language = language;
        },
        serverOperation(command: string) {
            switch (command) {
                case "start":
                    this.runServer();
                    break;
                case "stop":
                    this.stopServer();
                    break;
                case "dist":
                    Constant.FOLDER.DIST().then(path => {
                        NativeApi.openFolder(path);
                    })
                    break;
                case "browser":
                    NativeApi.openUrl("http://localhost:8888");
                    break;
            }
        },
        settingOperation(command: string) {
            switch (command){
                case "projectDir":
                    Constant.FOLDER.POST().then(path => {
                        NativeApi.openFolder(path);
                    })
                    break;
                case "devtools":
                    ApplicationApi.openDevTools().then(() => {
                        ElMessage({
                            showClose: true,
                            type: "success",
                            message: "打开成功"
                        })
                    });
                    break;
            }
        }
    }
})
</script>

<style lang="less">
</style>