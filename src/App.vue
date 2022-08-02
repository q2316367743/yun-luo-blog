<template>
    <div id="app">
        <div id="side">
            <div id="logo">云落博客</div>
            <el-menu :default-active="defaultActive" router>
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
                <el-menu-item :index="`/config/${blogSetting.type}`">
                    <el-icon>
                        <Menu/>
                    </el-icon>
                    <span>博客设置</span>
                </el-menu-item>
                <el-menu-item index="/setting">
                    <el-icon>
                        <setting/>
                    </el-icon>
                    <span>系统设置</span>
                </el-menu-item>
            </el-menu>
            <div class="footer">
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
                                <el-dropdown-item command="run">运行</el-dropdown-item>
                                <el-dropdown-item command="deploy">编译</el-dropdown-item>
                                <el-dropdown-item command="clean">清理</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <div id="body">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang='ts'>
import {defineComponent} from 'vue'
import {ArrowDown, CollectionTag, Document, Menu, PriceTag, Refresh, Setting} from '@element-plus/icons-vue';
import {ElMessage} from "element-plus";

import ApplicationUtil from '@/utils/ApplicationUtil';
import {useSettingStore} from "@/store/SettingStore";
import HexoUtil from "@/utils/HexoUtil";

export default defineComponent({
    components: {
        Document, ArrowDown, Setting, Refresh, PriceTag, Menu, CollectionTag
    },
    data: () => {
        return {
            blogSetting: useSettingStore().blogSetting,
            defaultActive: '/post/list'
        }
    },
    created() {
        ApplicationUtil.launch();
        ApplicationUtil.isInit("").then((isInit) => {
            if (!isInit) {
                // TODO: 如果没有初始化，则无法访问：主题。主题设置。插件、博客设置。
            }
        });
    },
    methods: {
        sync() {
            ApplicationUtil.sync().then(() => {
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: '同步成功'
                });
            })
        },
        commandClick(command: string) {
            switch (command) {
                case "init":
                    HexoUtil.init().then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '初始化完成'
                        });
                    }).catch(e => {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '初始化失败，' + e
                        });
                    });
                    break;
            }
        }
    }
})
</script>

<style lang="less">
#app {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
    display: flex;
}

#side {
    width: 200px;
    height: 100vh;
    border-right: #dcdfe6 solid 1px;
    position: relative;
    text-align: center;

    .el-menu {
        border-right: #ffffff !important;
    }

    .footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 10px;

        div {
            margin: 10px;

            button {
                margin: 0 auto;
            }
        }
    }
}

#body {
    width: 100%;
    position: relative;
}

#logo {
    height: 100px;
    width: 200px;
    line-height: 100px;
    font-size: 1.5em;
    user-select: none;
}
</style>