<template>
    <div id="app">
        <div id="side">
            <div id="logo">Hexo编辑器</div>
            <el-menu default-active="1">
                <el-menu-item index="1">
                    <el-icon>
                        <Document />
                    </el-icon>
                    <span>文章</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <el-icon>
                        <Sugar />
                    </el-icon>
                    <span>主题选择</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <el-icon>
                        <MoreFilled />
                    </el-icon>
                    <span>主题设置</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <el-icon>
                        <TrendCharts />
                    </el-icon>
                    <span>远程</span>
                </el-menu-item>
                <el-menu-item index="5">
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
        <div id="body"></div>
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { Document, Sugar, Setting, TrendCharts, MoreFilled, Refresh, DataBoard } from '@element-plus/icons-vue';

export default defineComponent({
    components: { Document, Sugar, Setting, TrendCharts, MoreFilled, Refresh, DataBoard },
    data: () => {
        return {
            menuId: '1',
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
}

#side {
    width: 200px;
    height: 100vh;
    border-right: #dcdfe6 solid 1px;
    position: relative;

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

#logo {
    height: 100px;
    width: 200px;
    line-height: 100px;
    font-size: 1.5em;
}
</style>