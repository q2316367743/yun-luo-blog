<template>
    <div id="theme">
        <el-scrollbar>
            <el-row>
                <el-col :span="24" style="margin-bottom: 10px" v-for="theme in themes" :key="theme">
                    <el-card>
                        <div class="theme-card">
                            <div>{{ theme }}</div>
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
        <div class="theme-add">
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
                    <el-input v-model="themeInfo.url" placeholder="请输入git远程地址"></el-input>
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
import {Plus} from "@element-plus/icons-vue";
import Hexo from "@/global/config/Hexo";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import {ElLoading, ElMessage, ElMessageBox} from "element-plus";
import NativeApi from "@/api/NativeApi";
import {useSettingStore} from "@/store/SettingStore";

/**
 * 查询两个东西：1.主题文件夹，2.package.json主题
 */
export default defineComponent({
    name: 'pretty-theme',
    setup() {
        const plus = markRaw(Plus);
        return {plus}
    },
    data: () => ({
        themeAddDialog: false,
        themeInfo: {
            mode: 1,
            url: ''
        },
        themes: new Array<string>(),
        themeActive: '',
        hexo: new Hexo()
    }),
    created() {
        Constant.PATH.HEXO_CONFIG().then(async path => {
            this.hexo.parse(await FileApi.readFile(path));
        });
        this.listTheme();
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
                url: ''
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
                    NativeApi.invokeCmd(gitPath, path, `clone ${this.themeInfo.url}`).then(() => {
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
                    });
                }).catch(e => {
                    console.error(e);
                    this.themeAddDialog = false;
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
        }
    }
});
</script>
<style scoped lang="less">
#theme {
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