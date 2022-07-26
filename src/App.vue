<template>
    <div id="app">
        <div id="side">
            <div id="logo">云落博客</div>
            <el-menu :default-active="defaultActive" @select="menuSelect" router>
                <el-menu-item index="/post/list">
                    <el-icon>
                        <Document />
                    </el-icon>
                    <span>文章</span>
                </el-menu-item>
                <el-menu-item index="/tag">
                    <el-icon>
                        <price-tag />
                    </el-icon>
                    <span>标签</span>
                </el-menu-item>
                <el-sub-menu index="/theme">
                    <template #title>
                        <el-icon>
                            <Sugar />
                        </el-icon>
                        <span>主题</span>
                    </template>
                    <el-menu-item index="/theme/list">列表</el-menu-item>
                    <el-menu-item index="/theme/setting">设置</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/plugin">
                    <el-icon>
                        <Sell />
                    </el-icon>
                    <span>插件</span>
                </el-menu-item>
                <el-menu-item :index="`/config/${blogSetting.type}`">
                    <el-icon>
                        <Menu />
                    </el-icon>
                    <span>博客设置</span>
                </el-menu-item>
                <el-menu-item index="/setting">
                    <el-icon>
                        <Setting />
                    </el-icon>
                    <span>系统设置</span>
                </el-menu-item>
            </el-menu>
            <div class="footer">
                <div>
                    <el-button type="default">
                        <el-icon>
                            <DataBoard />
                        </el-icon>
                        <span>预览</span>
                    </el-button>
                </div>
                <div>
                    <el-button type="primary">
                        <el-icon>
                            <Refresh />
                        </el-icon>
                        <span>同步</span>
                    </el-button>
                </div>
            </div>
        </div>
        <div id="body">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import {
    Document, Sugar, Setting, TrendCharts, MoreFilled,
    Refresh, DataBoard, Sell, PriceTag, Menu
} from '@element-plus/icons-vue';
import { useLocalStorage } from '@vueuse/core';
import { readDir } from '@tauri-apps/api/fs';
import { resolve, documentDir } from '@tauri-apps/api/path';

import { launch } from '@/utils/ApplicationUtil';
import Constant from '@/global/Constant';

export default defineComponent({
    components: {
        Document, Sugar, Setting, TrendCharts, MoreFilled, Refresh, DataBoard, Sell, PriceTag, Menu
    },
    data: () => {
        return {
            blogSetting: {
                type: 'hexo'
            },
            defaultActive: ''
        }
    },
    created() {
        launch();
        let isInit = localStorage.getItem('isInit');
        if (!isInit) {
            // 如果不存在相关字段，则进行校验
            const blogSetting = useLocalStorage('blogSetting', {
                type: 'hexo'
            });
            let type = blogSetting.value.type;
            // 获取项目目录下全部目录
            documentDir().then(documentPath => {
                resolve(documentPath, Constant.BASE).then(path => {
                    readDir(path).then(files => {
                        for (let file of files) {
                            // 存在，则为文件夹
                            if (file.children && file.name === type) {
                                // 终止处理
                                return;
                            }
                        }
                        // 执行到这里，正面没有这个文件夹，打开初始化进程
                        localStorage.removeItem('isInit');
                        this.$router.push('/guide');
                    });
                })
            })
        }
        // 处理菜单
        this.defaultActive = this.$route.path;
        // 博客配置
        this.blogSetting = useLocalStorage('blogSetting', {
            type: 'hexo'
        }).value;
    },
    methods: {
        menuSelect(id: string) {
            this.defaultActive = id;
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