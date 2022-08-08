<template>
    <div id="pretty-plugin">
        <el-scrollbar v-if="blogIsInit">
            <el-row>
                <el-col :span="24" style="margin-bottom: 10px" v-for="dependency in dependencies"
                        :key="dependency.name">
                    <el-card shadow="hover">
                        <div class="plugin-card">
                            <div>
                                <span>{{ dependency.name }}</span>
                                <el-tag style="margin-left: 10px;">{{ dependency.version }}</el-tag>
                            </div>
                            <div>
                                <el-button type="danger" link>删除</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-scrollbar>
        <div class="plugin-add" v-if="blogIsInit">
            <el-button type="primary" circle :icon="plus"></el-button>
        </div>
        <el-empty v-else description="博客尚未初始化，请先初始化后重试"/>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Edit, Plus} from "@element-plus/icons-vue";
import blogStrategyContext from "@/strategy/blog/BlogStrategyContext";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";

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
        dependencies: new Array<Dependency>()
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
            Constant.PATH.HEXO_PACKAGE_JSON().then(path => {
                FileApi.readFile(path).then(content => {
                    let packageJson = JSON.parse(content);
                    if (packageJson.dependencies) {
                        for (let dependency of Object.keys(packageJson.dependencies)) {
                            this.dependencies.push({
                                name: dependency,
                                version: packageJson.dependencies[dependency]
                            });
                        }
                    }
                })
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

    .plugin-add {
        position: absolute;
        right: 20px;
        bottom: 20px;
    }

    .plugin-card {
        display: flex;
        justify-content: space-between;
    }
}
</style>