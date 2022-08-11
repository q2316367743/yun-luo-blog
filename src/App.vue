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
            <el-menu :default-active="defaultActive" router :collapse="isCollapse">
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
                            :content="server ? $t('app.serverRun') : $t('app.serverStandby')"
                            placement="bottom"
                        >
                            <div class="nav-item" @click="runServer">
                                <el-icon>
                                    <run v-if="server" style="color: #67c23a;"/>
                                    <server v-else/>
                                </el-icon>
                            </div>
                        </el-tooltip>
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            :content="$t('common.setting')"
                            placement="bottom"
                        >
                            <div class="nav-item" @click="openSetting">
                                <el-icon>
                                    <setting/>
                                </el-icon>
                            </div>
                        </el-tooltip>
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

import ApplicationUtil from '@/utils/ApplicationUtil';
import {useSettingStore} from "@/store/SettingStore";
import Constant from "@/global/Constant";
import blogStrategyContext from "@/strategy/blog/BlogStrategyContext";
import NativeApi from "@/api/NativeApi";

import SettingPage from '@/pages/setting/index.vue';
import TerminalHexoPage from "@/pages/terminal/hexo/index.vue";

export default defineComponent({
    components: {
        Document, ArrowDown, Setting, Refresh, PriceTag, Menu, CollectionTag,
        ShoppingCartFull, SettingPage, Expand, Fold, Suitcase,
        Translate, TerminalBox, Sun, Moon, TerminalHexoPage, Server, Run
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
            basicSetting: useSettingStore().basicSetting,
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
            server: false
        }
    },
    created() {
        ApplicationUtil.launch();
        ApplicationUtil.suggest();
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
            this.server = !this.server;
            if (this.server) {
                // 服务运行
                blogStrategyContext.getStrategy().serverStart().then(() => {
                    ElMessage({
                        showClose: true,
                        type: "success",
                        message: "运行成功"
                    });
                }).catch((e => {
                    console.error(e);
                    ElMessage({
                        showClose: true,
                        type: "error",
                        message: "运行失败" + ',' + e
                    });
                }));
            } else {
                // 停止服务
                blogStrategyContext.getStrategy().serverStop().then(() => {
                    ElMessage({
                        showClose: true,
                        type: "success",
                        message: "停止运行"
                    });
                }).catch((e => {
                    if (e) {
                        console.error(e);
                        ElMessage({
                            showClose: true,
                            type: "error",
                            message: "停止运行失败" + ',' + e
                        });
                    }
                }));
            }
        },
        openFolder() {
            Constant.PATH.POST().then(path => {
                NativeApi.openFolder(path);
            })
        },
        toggleDark() {
            this.isDark = !this.isDark;
        },
        changeI18n(language: string) {
            this.$i18n.locale = language;
            this.basicSetting.language = language;
        }
    }
})
</script>

<style lang="less">
</style>