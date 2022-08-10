<template>
    <section id="app">
        <aside id="side" :style="{width: isCollapse ? '64px' : '200px'}">
            <div id="logo" :style="{display: isCollapse ? 'block' : 'flex'}">
                <div v-if="!isCollapse">云落博客</div>
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
                    <span>文章</span>
                </el-menu-item>
                <el-menu-item index="/tag">
                    <el-icon>
                        <price-tag/>
                    </el-icon>
                    <span>标签</span>
                </el-menu-item>
                <el-menu-item index="/category">
                    <el-icon>
                        <collection-tag/>
                    </el-icon>
                    <span>分类</span>
                </el-menu-item>
                <el-menu-item :index="`/pretty/${basicSetting.blogType}`">
                    <el-icon>
                        <shopping-cart-full></shopping-cart-full>
                    </el-icon>
                    <span>美化</span>
                </el-menu-item>
                <el-menu-item :index="`/config/${basicSetting.blogType}`">
                    <el-icon>
                        <Menu/>
                    </el-icon>
                    <span>博客设置</span>
                </el-menu-item>
            </el-menu>
            <div class="footer" v-show="!isCollapse">
                <div>
                    <el-button type="default" @click="sync">
                        <el-icon>
                            <refresh/>
                        </el-icon>
                        <span>同步</span>
                    </el-button>
                </div>
                <div>
                    <el-dropdown @command="commandClick">
                        <el-button type="primary">
                            <span>操作</span>
                            <el-icon class="el-icon--right">
                                <arrow-down/>
                            </el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="init">初始化</el-dropdown-item>
                                <el-dropdown-item command="server">运行</el-dropdown-item>
                                <el-dropdown-item command="deploy">编译</el-dropdown-item>
                                <el-dropdown-item command="clean">清理</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </aside>
        <section id="body">
            <header id="header">
                <div class="nav-bar">
                    <div class="left"></div>
                    <div class="navigation">
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            content="同步"
                            placement="bottom"
                        >
                            <div class="nav-item">
                                <el-icon>
                                    <refresh/>
                                </el-icon>
                            </div>
                        </el-tooltip>
                        <div class="nav-item">
                            <el-icon>
                                <full-screen/>
                            </el-icon>
                        </div>
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            content="Start一下，支持作者！"
                            placement="bottom"
                        >
                            <div class="nav-item" @click="openGit">
                                <el-icon>
                                    <suitcase/>
                                </el-icon>
                            </div>
                        </el-tooltip>
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            content="设置"
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
        <el-dialog v-model="settingDialog" fullscreen destroy-on-close append-to-body>
            <setting-page></setting-page>
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
    FullScreen,
    Menu,
    PriceTag,
    Refresh,
    Setting,
    ShoppingCartFull,
    Suitcase
} from '@element-plus/icons-vue';
import {ElMessage, ElMessageBox} from "element-plus";

import ApplicationUtil from '@/utils/ApplicationUtil';
import {useSettingStore} from "@/store/SettingStore";
import Constant from "@/global/Constant";
import SettingPage from '@/pages/setting/index.vue';
import blogStrategyContext from "@/strategy/blog/BlogStrategyContext";

import NativeApi from "@/api/NativeApi";

export default defineComponent({
    components: {
        Document, ArrowDown, Setting, Refresh, PriceTag, Menu, CollectionTag,
        ShoppingCartFull, SettingPage, FullScreen, Expand, Fold, Suitcase
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
            isCollapse: false
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
                    message: '同步成功'
                });
            }).catch(e => {
                ElMessageBox.alert(e, '同步失败', {
                    confirmButtonText: '确定',
                    type: "error",
                    draggable: true
                });
            })
        },
        openSetting() {
            this.settingDialog = true;
        },
        openGit() {
            NativeApi.openUrl("https://gitee.com/qiaoshengda/yun-luo-blog")
        },
        openFolder() {
            Constant.PATH.POST().then(path => {
                NativeApi.openFolder(path);
            })
        },
        commandClick(command: string) {
            switch (command) {
                case "init":
                    blogStrategyContext.getStrategy().init().then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '初始化完成'
                        });
                    }).catch(e => {
                        ElMessageBox.alert(e, '初始化失败', {
                            confirmButtonText: '确定',
                            type: "error",
                            draggable: true
                        });
                    });
                    break;
                case "deploy":
                    blogStrategyContext.getStrategy().deploy().then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '编译完成'
                        });
                    }).catch(e => {
                        ElMessageBox.alert(e, '编译失败', {
                            confirmButtonText: '确定',
                            type: "error",
                            draggable: true
                        });
                    });
                    break;
                case "server":
                    blogStrategyContext.getStrategy().server().then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '运行完成'
                        });
                    }).catch(e => {
                        ElMessageBox.alert(e, '运行失败', {
                            confirmButtonText: '确定',
                            type: "error",
                            draggable: true
                        });
                    });
                    break;
                case "clean":
                    blogStrategyContext.getStrategy().clean().then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '清理完成'
                        });
                    }).catch(e => {
                        ElMessageBox.alert(e, '清理失败', {
                            confirmButtonText: '确定',
                            type: "error",
                            draggable: true
                        });
                    });
                    break;
            }
        }
    }
})
</script>

<style lang="less">

@font-face {
    font-family: JetBrainsMono;
    src: url('./assets/JetBrainsMono-Medium.woff2');
}

@font-face {
    font-family: LXGWWenKai;
    src: url('./assets/LXGWWenKai-Light.woff');
}

* {
    margin: 0;
    padding: 0;
}

::selection {
    background: #FFAF74;
    color: #fff;
}

::-moz-selection {
    background: #FFAF74;
    color: #fff;
}

#app {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    display: flex;
}

#side {
    height: clac(100vh - 32px);
    position: relative;
    transition: 0.3s width ease-in-out;
    overflow-x: hidden;
    margin: 16px 0 16px 16px;
    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
    background-color: #ffffff;
    border-radius: 4px;

    .el-menu {
        border-right: #ffffff !important;
    }

    .footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 10px;
        padding: 10px;
        transition: 0.3s ease-in-out;
        text-align: center;

        div {
            margin: 10px;

            button {
                margin: 0 auto;
            }
        }
    }

    .bottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 5px;
        padding: 5px;
        display: grid;
        grid-template-rows: 1fr;
        text-align: center;
    }
}

#body {
    width: 100%;
    position: relative;
}

#header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    z-index: 1;

    .nav-bar {
        margin: 16px 16px 0 16px;
        height: 40px;
        display: flex;
        justify-content: space-between;
        border-radius: 4px;
        z-index: 9999999;

        .navigation {
            box-shadow: 0 0 12px rgba(0, 0, 0, .12);
            display: flex;
            align-items: center;
            height: 100%;
            margin-left: auto;
            background-color: #ffffff;

            .nav-item {
                padding: 10px 15px;
                cursor: pointer;

                &:hover {
                    background-color: #f5f5f5;
                }
            }
        }
    }
}

#container {
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px;
    bottom: 16px;
}

// 通用
#container-header {
    background-color: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    right: clac(184px + 16px);
    height: 40px;
    z-index: 2;
    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
    border-radius: 4px;

    &>.el-button {
        margin: 5px;
        height: 32px;
    }
}
#container-main {
    background-color: #ffffff;
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0 0 12px rgba(0, 0, 0, .12);
    border-radius: 4px;
}

#logo {
    height: 30px;
    margin: 10px;
    width: clac(100% - 20px);
    line-height: 30px;
    font-size: 1.5em;
    user-select: none;
    justify-content: space-between;
    overflow: hidden;
}
</style>