<template>
    <div id="pretty-theme">
        <el-scrollbar v-if="blogIsInit">
            <el-row>
                <el-col :span="24" style="margin-bottom: 10px" v-for="theme in themes" :key="theme">
                    <el-card shadow="hover">
                        <div class="theme-card">
                            <div>
                                <span>{{ theme }}</span>
                                <el-button type="primary" link :icon="edit" @click="themeRename(theme)"></el-button>
                            </div>
                            <div>
                                <el-button type="success" link :disabled="theme === hexo.theme"
                                           @click="chooseTheme(theme)">选中
                                </el-button>
                                <el-button type="danger" link>删除</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-scrollbar>
        <el-empty v-else description="博客尚未初始化，请先初始化后重试"/>
        <div class="theme-add" v-if="blogIsInit">
            <el-button type="primary" circle :icon="plus" @click="openThemeAddDialog"></el-button>
        </div>
        <el-dialog v-model="themeAddDialog" title="新增主题">
            <el-form label-width="80px">
                <el-form-item label="方式">
                    <el-radio-group v-model="themeInfo.mode">
                        <el-radio :label="1">git</el-radio>
                        <el-radio :label="2">npm</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="地址" v-if="themeInfo.mode === 1">
                    <el-input v-model="themeInfo.url" placeholder="请输入git远程地址（必填）"></el-input>
                </el-form-item>
                <el-form-item label="主题重命名" v-if="themeInfo.mode === 1">
                    <el-input v-model="themeInfo.name" placeholder="请输入新的主题重命名"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="themeAddDialog = false">取消</el-button>
                <el-button type="primary" @click="themeAddClick">新增</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Edit, Plus} from "@element-plus/icons-vue";
import Hexo from "@/global/config/Hexo";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import {ElLoading, ElMessage, ElMessageBox} from "element-plus";
import NativeApi from "@/api/NativeApi";
import {useSettingStore} from "@/store/SettingStore";
import blogStrategyContext from "@/strategy/blog/BlogStrategyContext";

/**
 * 查询两个东西：1.主题文件夹，2.package.json主题
 */
export default defineComponent({
    name: 'pretty-theme',
    setup() {
        const plus = markRaw(Plus);
        const edit = markRaw(Edit);
        return {plus, edit}
    },
    data: () => ({
        themeAddDialog: false,
        themeInfo: {
            mode: 1,
            url: '',
            name: ''
        },
        themes: new Array<string>(),
        themeActive: '',
        hexo: new Hexo(),
        blogIsInit: false
    }),
    created() {
        blogStrategyContext.getStrategy().isInit().then(isInit => {
            this.blogIsInit = isInit;
            if (isInit) {
                // 初始化后在进行查询
                Constant.PATH.HEXO_CONFIG().then(async path => {
                    this.hexo.parse(await FileApi.readFile(path));
                });
                this.listTheme();
            }
        });
    },
    methods: {
        listTheme() {
            Constant.PATH.HEXO_THEME().then(path => {
                FileApi.listDir(path, false).then(files => {
                    this.themes = new Array<string>();
                    let themes = new Array<string>();
                    for (let file of files) {
                        if (file.children && file.name && file.name !== "") {
                            themes.push(file.name)
                        }
                    }
                    this.themes = themes;
                })
            })
        },
        openThemeAddDialog() {
            this.themeInfo = {
                mode: 1,
                url: '',
                name: ''
            }
            this.themeAddDialog = true;
        },
        themeAddClick() {
            if (this.themeInfo.mode === 1) {
                // git
                if (this.themeInfo.url === "") {
                    ElMessage({
                        showClose: true,
                        type: "warning",
                        message: "请输入git地址"
                    })
                    return;
                }
                let gitPath = useSettingStore().environment.gitPath;
                if (!gitPath || gitPath === "") {
                    ElMessage({
                        showClose: true,
                        type: "warning",
                        message: "请配置git命令地址"
                    })
                    return;
                }
                // 执行命令
                const loading = ElLoading.service({
                    lock: true,
                    text: '主题clone中',
                    background: 'rgba(0, 0, 0, 0.7)',
                });
                Constant.PATH.HEXO_THEME().then(path => {
                    NativeApi.invokeCmd(
                        gitPath,
                        path,
                        `clone ${this.themeInfo.url.trim()} ${this.themeInfo.name.trim()}`
                    ).then(() => {
                        ElMessage({
                            showClose: true,
                            type: "success",
                            message: "clone成功"
                        });
                        this.listTheme();
                        loading.close();
                        this.themeAddDialog = false;
                    }).catch(e => {
                        console.error(e);
                        this.themeAddDialog = false;
                        loading.close();
                    });
                }).catch(e => {
                    console.error(e);
                    ElMessage({
                        showClose: true,
                        type: "error",
                        message: "clone错误，" + e
                    });
                    this.themeAddDialog = false;
                    loading.close();
                });
            } else if (this.themeInfo.mode === 2) {
                // npm
            }
        },
        chooseTheme(theme: string) {
            this.hexo.theme = theme;
            Constant.PATH.HEXO_CONFIG().then(path => {
                FileApi.writeFile(path, this.hexo.render()).then(() => {
                    ElMessage({
                        showClose: true,
                        message: '主题已切换',
                        type: 'success',
                    });
                    this.listTheme();
                }).catch((e) => {
                    ElMessage({
                        showClose: true,
                        message: "主题切换失败，" + e,
                        type: 'error',
                    })
                });
            })
        },
        themeRename(theme: string) {
            ElMessageBox.prompt('新输入新的主要名字', '主题重命名', {
                confirmButtonText: '修改',
                cancelButtonText: '取消',
                inputValue: theme
            }).then(async ({value}) => {
                console.log('开始重命名', theme, value.trim())
                // 0. 验证主题名字不能与原先一样
                console.log("0. 验证主题名字不能与原先一样")
                console.log("value.trim() === \"\"", value.trim() === "");
                if (value.trim() === "") {
                    console.log("主题名字不能为空")
                    ElMessage({
                        showClose: true,
                        type: "warning",
                        message: "主题名字不能为空"
                    });
                    return false
                }
                console.log("value.trim() === theme.trim()", value.trim() === theme.trim());
                if (value.trim() === theme.trim()) {
                    console.log("主题名字不能与原先一样")
                    ElMessage({
                        showClose: true,
                        type: "warning",
                        message: "主题名字不能与原先一样"
                    });
                    return false
                }
                // 1. 重命名
                console.log("1. 重命名")
                let themePath = await Constant.PATH.HEXO_THEME();
                let oldPath = await FileApi.resolve(themePath, theme);
                let newPath = await FileApi.resolve(themePath, value);
                await FileApi.rename(oldPath, newPath);
                // 2. 如果当前主题已被选中修改hexo主题选择
                console.log("2. 如果当前主题已被选中修改hexo主题选择")
                if (this.hexo.theme.trim() !== value.trim()) {
                    console.log("2.1 修改主题")
                    // 修改主题文件或创建主题文件
                    let oldConfigPath = await FileApi.resolve(await Constant.PATH.HEXO(), `_config.${this.hexo.theme.trim()}.yml`);
                    let newConfigPath = await FileApi.resolve(await Constant.PATH.HEXO(), `_config.${value.trim()}.yml`);
                    if (await FileApi.exist(oldConfigPath)) {
                        // 存在，则重命名
                        await FileApi.rename(oldConfigPath, newConfigPath);
                    }else {
                        // 不存在，则创建
                        await FileApi.createDir(newConfigPath);
                    }
                    let configPath = await Constant.PATH.HEXO_CONFIG();
                    this.hexo.theme = value.trim();
                    await FileApi.writeFile(configPath, this.hexo.render());
                }
                // 3. 重新查询主题
                console.log("3. 重新查询主题")
                this.listTheme();
                ElMessage({
                    showClose: true,
                    type: 'success',
                    message: `主题重命名成功`,
                })
            }).catch(() => {
                ElMessage({
                    showClose: true,
                    type: 'info',
                    message: '取消重命名',
                })
            })
        }
    }
});
</script>
<style scoped lang="less">
#pretty-theme {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .theme-add {
        position: absolute;
        right: 20px;
        bottom: 20px;
    }
}

.theme-card {
    display: flex;
    justify-content: space-between;
}
</style>