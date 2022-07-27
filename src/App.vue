<template>
    <div id="app">
        <div id="side">
            <div id="logo">云落博客</div>
            <el-menu :default-active="defaultActive" router>
                <el-menu-item index="/post/list">
                    <el-icon>
                        <Document/>
                    </el-icon>
                    <span>文章</span>
                </el-menu-item>
                <el-menu-item index="/tag">
                    <el-icon>
                        <price-tag/>
                    </el-icon>
                    <span>标签</span>
                </el-menu-item>
                <el-sub-menu index="/theme">
                    <template #title>
                        <el-icon>
                            <Sugar/>
                        </el-icon>
                        <span>主题</span>
                    </template>
                    <el-menu-item index="/theme/list">列表</el-menu-item>
                    <el-menu-item index="/theme/setting">设置</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/plugin">
                    <el-icon>
                        <Sell/>
                    </el-icon>
                    <span>插件</span>
                </el-menu-item>
                <el-menu-item :index="`/config/${blogSetting.type}`">
                    <el-icon>
                        <Menu/>
                    </el-icon>
                    <span>博客设置</span>
                </el-menu-item>
                <el-menu-item index="/setting">
                    <el-icon>
                        <Setting/>
                    </el-icon>
                    <span>系统设置</span>
                </el-menu-item>
            </el-menu>
            <div class="footer">
                <div>
                    <el-button type="default" @click="sync">
                        <el-icon>
                            <Refresh/>
                        </el-icon>
                        <span>同步</span>
                    </el-button>
                </div>
                <div>
                    <el-dropdown>
                        <el-button type="primary">
                            <span>操作</span>
                            <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>Action 1</el-dropdown-item>
                                <el-dropdown-item>Action 2</el-dropdown-item>
                                <el-dropdown-item>Action 3</el-dropdown-item>
                                <el-dropdown-item>Action 4</el-dropdown-item>
                                <el-dropdown-item>Action 5</el-dropdown-item>
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
import {
    DataBoard,
    Document,
    Menu,
    MoreFilled,
    PriceTag,
    Refresh,
    Sell,
    Setting,
    Sugar,
    TrendCharts,
    ArrowDown
} from '@element-plus/icons-vue';

import ApplicationUtil from '@/utils/ApplicationUtil';
import {ElMessage} from "element-plus";

export default defineComponent({
    components: {
        Document, Sugar, Setting, TrendCharts, MoreFilled, Refresh, DataBoard, Sell, PriceTag, Menu, ArrowDown
    },
    data: () => {
        return {
            blogSetting: {
                type: 'hexo'
            },
            defaultActive: '、'
        }
    },
    created() {
        ApplicationUtil.launch();
        ApplicationUtil.isInit("").then((isInit) => {
            if (!isInit) {
                // TODO: 如果没有初始化，则无法访问：主题。主题设置。插件、博客设置。
            }
        })
    },
    methods: {
        sync() {
            // TODO: 同步：将文章复制到目标文件夹 -> 执行构建命令 -> 推送到远程
            ElMessage({
                showClose: true,
                type: 'success',
                message: '同步成功'
            })
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