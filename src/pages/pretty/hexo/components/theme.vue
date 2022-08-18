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
        <el-empty v-else :description="$t('hint.blog_not_init')"/>
        <div class="theme-add" v-if="blogIsInit">
            <el-button type="primary" circle :icon="plus" @click="openThemeAddDialog"></el-button>
        </div>
        <el-dialog v-model="themeAddDialog" title="新增主题" draggable top="25vh">
            <el-form label-width="100px">
                <el-form-item label="方式">
                    <el-radio-group v-model="themeInfo.mode">
                        <el-radio :label="1">git</el-radio>
                        <el-radio :label="2">压缩包</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="主题重命名">
                    <el-input v-model="themeInfo.name" placeholder="请输入新的主题重命名（非必填）"></el-input>
                </el-form-item>
                <el-form-item label="地址" v-if="themeInfo.mode === 1">
                    <el-input v-model="themeInfo.url" placeholder="请输入git远程地址（必填）"></el-input>
                </el-form-item>
                <el-form-item label="压缩包地址" v-if="themeInfo.mode === 2">
                    <el-input v-model="themeInfo.compressionPath">
                        <template #append>
                            <el-button :icon="folder" @click="openThemeDialog"/>
                        </template>
                    </el-input>
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
import {Edit, Folder, Plus} from "@element-plus/icons-vue";
import Hexo from "@/global/config/Hexo";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import {ElLoading, ElMessage, ElMessageBox} from "element-plus";
import NativeApi from "@/api/NativeApi";
import blogStrategyContext from "@/strategy/blog/BlogStrategyContext";
import DialogApi from "@/api/DialogApi";
import {settingService} from "@/global/BeanFactory";
import constant from "@/global/Constant";

/**
 * 查询两个东西：1.主题文件夹，2.package.json主题
 */
export default defineComponent({
    name: 'pretty-theme',
    setup() {
        const plus = markRaw(Plus);
        const edit = markRaw(Edit);
        const folder = markRaw(Folder);
        return {plus, edit, folder}
    },
    data: () => ({
        themeAddDialog: false,
        themeInfo: {
            mode: 1,
            name: '',
            url: '',
            compressionPath: ''
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
                Constant.FOLDER.HEXO_CONFIG().then(async path => {
                    this.hexo.parse(await FileApi.readFile(path));
                });
                this.listTheme();
            }
        });
    },
    methods: {
        listTheme() {
            Constant.FOLDER.HEXO_THEME().then(path => {
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
                name: '',
                compressionPath: ''
            }
            this.themeAddDialog = true;
        },
        themeAddClick() {
            if (this.themeInfo.mode === 1) {
                this.themeForGit();
            } else if (this.themeInfo.mode === 2) {
                this.themeForCompression();
            }
        },
        themeForGit() {
            // git
            if (this.themeInfo.url === "") {
                ElMessage({
                    showClose: true,
                    type: "warning",
                    message: "请输入git地址"
                })
                return;
            }
            let gitPath = settingService.getEnvironment().gitPath;
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
            Constant.FOLDER.HEXO_THEME().then(path => {
                NativeApi.invokeSync(
                    gitPath,
                    path,
                    `clone ${this.themeInfo.url.trim()} ${this.themeInfo.name.trim()}`
                ).then(() => {
                    ElMessage({
                        showClose: true,
                        type: "success",
                        message: "clone成功"
                    });
                    // 需要将配置文件拿出来
                    let currPath: string;
                    if (this.themeInfo.name.trim() !== "") {
                        currPath = this.themeInfo.name.trim()
                    }else {
                        let items = this.themeInfo.url.trim().split('/');
                        currPath = items[items.length - 1];
                    }
                    this.configFileTransfer(currPath);
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
        },
        async themeForCompression() {
            if (this.themeInfo.compressionPath === "") {
                ElMessage.error({
                    showClose: true,
                    type: "error",
                    message: "请选择压缩包目录"
                });
                return;
            }
            // 解压
            const options = {
                type: 1,
                source: "",
                target: "",
            }
            // 判断类型
            if (this.themeInfo.compressionPath.toLowerCase().endsWith("tar")) {
                options.type = 1;
            } else if (this.themeInfo.compressionPath.toLowerCase().endsWith("gz")) {
                options.type = 2;
            } else if (this.themeInfo.compressionPath.toLowerCase().endsWith("tgz")) {
                options.type = 3;
            } else if (this.themeInfo.compressionPath.toLowerCase().endsWith("zip")) {
                options.type = 4;
            } else {
                ElMessage.error({
                    showClose: true,
                    type: "error",
                    message: "未知压缩格式，只支持后缀为.tar、.gz、.tgz、.zip压缩格式"
                });
                return;
            }
            options.source = this.themeInfo.compressionPath;
            let themeFolderName: string;
            if (this.themeInfo.name && this.themeInfo.name !== '') {
                themeFolderName = this.themeInfo.name;
                options.target = await FileApi.resolve(await Constant.FOLDER.HEXO_THEME(), this.themeInfo.name);
            } else {
                let tempPath = this.themeInfo.compressionPath;
                tempPath = tempPath.replaceAll("\\", "/");
                let name = tempPath.substring(tempPath.lastIndexOf("/") + 1);
                name = name.substring(0, name.lastIndexOf("."));
                themeFolderName = name;
                options.target = await FileApi.resolve(await Constant.FOLDER.HEXO_THEME(), name);
            }
            const loading = ElLoading.service({
                lock: true,
                text: '主题解压中',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            NativeApi.compressing(options).then(() => {
                // 文件复制
                this.configFileTransfer(themeFolderName);
                this.listTheme();
                this.themeAddDialog = false;
                loading.close();
            }).catch(e => {
                console.error(e);
                ElMessage({
                    showClose: true,
                    type: "error",
                    message: "主题解压错误，" + e
                });
                this.themeAddDialog = false;
                loading.close();
            });
        },
        chooseTheme(theme: string) {
            this.hexo.theme = theme;
            Constant.FOLDER.HEXO_CONFIG().then(path => {
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
                let themePath = await Constant.FOLDER.HEXO_THEME();
                let oldPath = await FileApi.resolve(themePath, theme);
                let newPath = await FileApi.resolve(themePath, value);
                await FileApi.rename(oldPath, newPath);
                // 2. 如果当前主题已被选中修改hexo主题选择
                console.log("2. 如果当前主题已被选中修改hexo主题选择")
                if (this.hexo.theme.trim() !== value.trim()) {
                    console.log("2.1 修改主题")
                    // 修改主题文件或创建主题文件
                    let oldConfigPath = await FileApi.resolve(await Constant.FOLDER.HEXO(), `_config.${this.hexo.theme.trim()}.yml`);
                    let newConfigPath = await FileApi.resolve(await Constant.FOLDER.HEXO(), `_config.${value.trim()}.yml`);
                    if (await FileApi.exist(oldConfigPath)) {
                        // 存在，则重命名
                        await FileApi.rename(oldConfigPath, newConfigPath);
                    } else {
                        // 不存在，则创建
                        await FileApi.createDir(newConfigPath);
                    }
                    let configPath = await Constant.FOLDER.HEXO_CONFIG();
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
            })
        },
        openThemeDialog() {
            // 上床文件
            DialogApi.open({
                multiple: false,
                directory: false,
                title: "请选择主题压缩文件",
                filters: [{
                    name: "压缩包",
                    extensions: ['tar', 'gz', 'tgz', 'zip']
                }]
            }).then(select => {
                if (select && select.length > 0) {
                    this.themeInfo.compressionPath = select[0]
                }
            }).catch(e => {
                console.error(e);
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '选择文件失败，' + e
                })
            })
        },
        configFileTransfer(name: string) {
            Constant.FOLDER.HEXO_THEME().then(hexoTheme => {
                FileApi.resolve(hexoTheme, name, Constant.HEXO.FILE.CONFIG).then(themeConfigPath => {
                    FileApi.exist(themeConfigPath).then(themeConfigExist => {
                        if (themeConfigExist) {
                            Constant.FOLDER.HEXO().then(hexoPath => {
                                FileApi.resolve(hexoPath, Constant.HEXO.FILE.THEME_CONFIG(name)).then(hexoThemeConfigPath =>{
                                    FileApi.copyFile(themeConfigPath, hexoThemeConfigPath);
                                })
                            })
                        }
                    })
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
        position: fixed;
        right: 120px;
        bottom: 42px;
    }
}

.theme-card {
    display: flex;
    justify-content: space-between;
}
</style>