<template>
    <section id="app">
        <aside id="side" :style="{width: isCollapse ? '64px' : '200px'}">
            <div id="logo" :style="{display: isCollapse ? 'block' : 'flex'}">
                <div v-if="!isCollapse">
                    <el-icon style="cursor:pointer;" @click="updateSite">
                        <CaretBottom/>
                    </el-icon>
                    <span>{{ site.key }}</span></div>
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
                <el-menu-item index="/page/list">
                    <el-icon>
                        <Memo/>
                    </el-icon>
                    <span>{{ $t('menu.page') }}</span>
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
                    <span>{{ $t('menu.blog_setting') }}</span>
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
                        <!-- 同步 -->
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            :content="$t('common.synchronous')"
                            placement="bottom"
                        >
                            <div class="nav-item" @click="sync">
                                <el-icon>
                                    <Upload/>
                                </el-icon>
                            </div>
                        </el-tooltip>
                        <!-- 环境 -->
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            :content="environmentName"
                            placement="bottom"
                        >
                            <el-dropdown trigger="click" ref="environmentDropdown">
                                <div class="nav-item">
                                    <el-icon :size="18">
                                        <environment-icon/>
                                    </el-icon>
                                </div>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-radio-group v-model="environmentId" style="display: block"
                                                        @change="changeEnvironment">
                                            <el-dropdown-item v-for="environment in environments"
                                                              :command="environment.id">
                                                <el-radio :label="environment.id">{{ environment.name }}</el-radio>
                                            </el-dropdown-item>
                                        </el-radio-group>
                                        <el-dropdown-item @click.prevent="toEnvironment" :icon="more">管理
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </el-tooltip>
                        <!-- 终端 -->
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
                        <!-- 服务器 -->
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            :content="serverStatus"
                            placement="bottom"
                        >
                            <el-dropdown trigger="contextmenu" @command="serverOperation">
                                <div class="nav-item" @click="serverStatusSwitch">
                                    <el-icon :size="18">
                                        <run v-if="server === 1" style="color: #67c23a;"/>
                                        <loader v-else-if="server === 2"/>
                                        <server v-else-if="server === 3"/>
                                    </el-icon>
                                </div>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item command="start" v-if="server === 3">
                                            {{ $t('app.server_start') }}
                                        </el-dropdown-item>
                                        <el-dropdown-item command="stop" v-if="server === 1">
                                            {{ $t('app.server_stop') }}
                                        </el-dropdown-item>
                                        <el-dropdown-item command="update" v-if="server === 1">
                                            {{ $t('app.server_update_now') }}
                                        </el-dropdown-item>
                                        <el-dropdown-item command="browser" v-if="server === 1 || server === 2">
                                            {{ $t('app.open_browser') }}
                                        </el-dropdown-item>
                                        <el-dropdown-item command="dist">{{ $t('app.open_dist') }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </el-tooltip>
                        <!-- 更多 -->
                        <el-dropdown trigger="click" @command="moreCommand">
                            <div class="nav-item">
                                <el-icon :size="18">
                                    <more/>
                                </el-icon>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="languageToEnglish"
                                                      v-if="basicSetting.language === 'zhCn'">
                                        <el-icon :size="18">
                                            <translate/>
                                        </el-icon>
                                        <span>变为英语</span></el-dropdown-item>
                                    <el-dropdown-item command="languageToChinese"
                                                      v-if="basicSetting.language === 'enUs'">
                                        <el-icon :size="18">
                                            <translate/>
                                        </el-icon>
                                        <span>变为中文</span></el-dropdown-item>
                                    <el-dropdown-item command="toggleDark">
                                        <el-icon :size="18">
                                            <sun v-if="!isDark"/>
                                            <moon v-else></moon>
                                        </el-icon>
                                        <span>{{ isDark ? $t('common.dark') : $t('common.light') }}</span>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <!-- 设置 -->
                        <el-dropdown trigger="contextmenu" @command="settingOperation">
                            <div class="nav-item" @click="openSetting">
                                <el-icon :size="18">
                                    <setting/>
                                </el-icon>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="projectDir">
                                        {{ $t('app.open_project_dir') }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="devtools">
                                        {{ $t('app.open_dev_tools') }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="workspace">
                                        {{ $t('app.switch_workspace') }}
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
        <el-drawer v-model="settingDialog" size="500px" destroy-on-close :with-header="false">
            <setting-page></setting-page>
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
    CaretBottom,
    CollectionTag,
    Document,
    Expand,
    Fold,
    Folder,
    Memo,
    Menu,
    More,
    PriceTag,
    Setting,
    ShoppingCartFull,
    Suitcase,
    Upload
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
import {environmentService, serverService, settingService} from "@/global/BeanFactory";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import ServerStatusEnum from "@/enumeration/ServerStatusEnum";
import ApplicationApi from "@/api/ApplicationApi";
import Entry from "@/global/Entry";
import LocalStorageUtil from "@/utils/LocalStorageUtil";
import Environment from "@/entities/Environment";
import EnvironmentIcon from "@/icon/Environment.vue";

export default defineComponent({
    components: {
        Document, ArrowDown, Setting, Upload, PriceTag, Menu, CollectionTag,
        ShoppingCartFull, SettingPage, Expand, Fold, Suitcase, Tools,
        Translate, TerminalBox, Sun, Moon, TerminalHexoPage, Server, Run,
        Loader, CaretBottom, Memo, More, EnvironmentIcon
    },
    data: () => {
        return {
            setting: markRaw(Setting),
            folder: markRaw(Folder),
            more: markRaw(More),
            basicSetting: settingService.getBasic(),
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
            serverDisable: false,
            site: {
                id: 0,
                key: '',
                value: ''
            } as Entry,
            environmentId: 0,
            environmentName: '未配置',
            environments: new Array<Environment>()
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
        emitter.on(MessageEventEnum.APP_LAUNCH, () => {
            // APP启动，重新获取站点名称
            this.site = LocalStorageUtil.getOrDefault(Constant.LOCALSTORAGE.SITE, {
                id: 0,
                key: this.$t('app.project_name'),
                value: ''
            });
            this.initEnvironment();
        });
        emitter.on(MessageEventEnum.TERMINAL_OPEN, () => {
            // 终端对话框启动
            this.terminalDialog = true;
        });
        emitter.on(MessageEventEnum.ENVIRONMENT_CHANGE, () => {
            this.initEnvironment();
        });
        this.initEnvironment();
        this.$router.push('/loading');
    },
    computed: {
        serverStatus(): string {
            if (ServerStatusEnum.RUN === this.server) {
                return this.$t('app.server_run')
            } else if (this.server === ServerStatusEnum.UPDATE) {
                return this.$t('app.server_update');
            } else if (this.server === ServerStatusEnum.STOP) {
                return this.$t('app.server_standby');
            } else {
                return this.$t('app.server_unknown');
            }
        },
    },
    methods: {
        sync() {
            blogStrategyContext.getStrategy().sync().then(() => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: this.$t('app.sync_success')
                });
            }).catch(e => {
                ElMessageBox.alert(e, this.$t('app.sync_fail'), {
                    confirmButtonText: this.$t('common.confirm'),
                    type: "error",
                    draggable: true
                });
            })
        },
        initEnvironment() {
            // 获取全部环境信息
            this.environments = environmentService.list();
            // 获取当前环境ID
            this.environmentId = environmentService.getId();
            if (this.environmentId !== 0) {
                this.environmentName = environmentService.getCurrentEnvironment().name;
            }
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
                case "update":
                    serverService.serverUpdate();
                    break;
                case "dist":
                    Constant.FOLDER.DIST().then(path => {
                        NativeApi.openFolder(path);
                    })
                    break;
                case "browser":
                    NativeApi.openUrl(`http://localhost:${settingService.getServer().port}`);
                    break;
            }
        },
        settingOperation(command: string) {
            switch (command) {
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
                            message: this.$t('hint.open_success')
                        })
                    });
                    break;
                case "workspace":
                    this.$router.push('/workspace');
                    break;
            }
        },
        updateSite() {
            this.$router.push('/site');
        },
        changeEnvironment(id: number) {
            environmentService.choose(id);
        },
        toEnvironment() {
            let environmentDropdown = this.$refs.environmentDropdown as any;
            environmentDropdown.handleClose();
            this.$router.push('/tool/environment');
        },
        serverStatusSwitch() {
            if (this.server === ServerStatusEnum.STOP) {
                // 服务器已停止，运行
                this.serverOperation("start")
            } else if (this.server === ServerStatusEnum.RUN) {
                // 服务器正在运行，停止
                this.serverOperation("stop");
            }
        },
        moreCommand(command: string) {
            switch (command) {
                case 'languageToEnglish':
                    this.changeI18n('enUs');
                    break;
                case 'languageToChinese':
                    this.changeI18n('zhCn');
                    break;
                case 'toggleDark':
                    this.toggleDark();
                    break;
            }
        }
    }
})
</script>

<style lang="less">
</style>