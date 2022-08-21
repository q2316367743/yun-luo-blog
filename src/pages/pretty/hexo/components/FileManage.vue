<template>
    <div id="file-manage">
        <div class="file-menu" @click="fileMenuClick">
            <el-scrollbar>
                <el-tree :data="files" :props="fileProps" @node-click="nodeClick" empty-text="暂无文件"/>
            </el-scrollbar>
        </div>
        <div class="file-editor">
            <theme-file-editor v-model="fileContent" v-model:language="language" v-show="fileContent !== ''"></theme-file-editor>
            <el-empty description="请选择文件" v-if="fileContent === ''" style="margin-top: 15vh"></el-empty>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import FileEntry from "@/api/entities/FileEntry";
import Constant from "@/global/Constant";
import Hexo from "@/global/config/Hexo";
import FileApi from "@/api/FileApi";
import ThemeFileEditor from "@/components/ThemeFileEditor/index.vue";
import {ElMessage} from "element-plus";
import ArrayUtil from "@/utils/ArrayUtil";

interface File {

    /**
     * 文件名字
     */
    name: string;
    /**
     * 文件路径
     */
    path: string;
    /**
     * 子文件夹，如果是文件，为没有null
     */
    children?: Array<File>;

}

export default defineComponent({
    name: 'file-manage',
    components: {ThemeFileEditor},
    data: () => ({
        themeName: '',
        files: new Array<FileEntry>(),
        fileProps: {
            children: 'children',
            label: 'name',
        },
        // 当前主题
        file: {} as FileEntry | undefined,
        fileContent: '',
        language: ''
    }),
    async created() {
        // 初始化主题名
        let hexoConfigBase = await Constant.FILE.HEXO_CONFIG_BASE();
        let hexo = new Hexo(await FileApi.readFile(hexoConfigBase));
        this.themeName = hexo.theme;
        // 获取主题目录下文件
        await this.mapFiles();
        // 增加快捷键
        document.onkeydown = (e) => {
            // 各种快捷键
            if (e.ctrlKey) {
                if (e.code == 'KeyS') {
                    this.save();
                }
            }
        }
    },
    unmounted() {
        // 取消快捷键
        document.onkeydown = null;
    },
    methods: {
        async mapFiles() {
            // 获取主题目录
            let hexoThemePath = await Constant.FOLDER.HEXO.THEME();
            // 获取当前主题目录
            let currentThemeDir = await FileApi.resolve(hexoThemePath, this.themeName);
            // 目录下全部文件
            this.files = await FileApi.listDir(currentThemeDir, true);
        },
        nodeClick(data: FileEntry) {
            if (!data.isDirectory) {
                this.file = data;
                this.language = data.path.substring(data.path.lastIndexOf('.') + 1);
                if (ArrayUtil.contains(['jpg', 'jpeg', 'png', 'gif', 'webp'], this.language)) {
                    ElMessage({
                        showClose: true,
                        type: 'warning',
                        message: '不能打开图片'
                    });
                    this.fileContent = '';
                    return;
                }
                FileApi.readFile(data.path).then(content => {
                    // 读取这里文件内容
                    this.fileContent = content;
                })
            }
        },
        save() {
            // 保存
            if (this.file && this.file.path && this.file.path !== '') {
                FileApi.writeFile(this.file.path, this.fileContent).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: this.$t('hint.save_success')
                    });
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: this.$t('hint.save_fail') + ',' + e
                    });
                })
            }else {
                ElMessage({
                    showClose: true,
                    type: 'warning',
                    message: '未选择文件'
                });
            }
        },
        fileMenuClick() {
            this.file = undefined;
            this.fileContent = ''
        }
    }
});
</script>
<style lang="less">
#file-manage {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .file-menu {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 200px;
        border-right: #eeeeee solid 1px;
    }

    .file-editor {
        position: absolute;
        top: 0;
        left: 200px;
        right: 0;
        bottom: 0;
    }
}
</style>