<template>
    <div id="pretty-hexo-theme-editor">
        <div class="editor">
            <theme-config-editor v-model="theme"></theme-config-editor>
        </div>
        <div class="option">
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import ThemeConfigEditor from "@/components/ThemeConfigEditor/index.vue";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";
import Hexo from "@/global/config/Hexo";
import {ElMessage} from "element-plus";

export default defineComponent({
    name: 'theme-editor',
    components: {ThemeConfigEditor},
    data: () => ({
        theme: '',
        themeName: ''
    }),
    created() {
        // 获取主题配置文件
        Constant.FILE.HEXO_CONFIG_BASE().then(path => {
            FileApi.readFile(path).then(content => {
                let hexo = new Hexo(content);
                Constant.FOLDER.HEXO.BASE().then(hexoPath => {
                    this.themeName = hexo.theme;
                    // 主题配置
                    FileApi.resolve(hexoPath, `_config.${hexo.theme}.yml`).then(themePath => {
                        FileApi.readFile(themePath).then(themeContent => {
                            this.theme = themeContent;
                        }).catch((e) => {
                            console.error('不存在目录', e);
                        })
                    })
                });
            });
        });
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
        save() {
            Constant.FOLDER.HEXO.BASE().then(hexoPath => {
                // 主题配置
                FileApi.resolve(hexoPath, `_config.${this.themeName}.yml`).then(themePath => {
                    FileApi.writeFile(themePath, this.theme).then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: this.$t('hint.save_success')
                        });
                    }).catch((e) => {
                        console.error(e);
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: this.$t('hint.save_fail') + ',' + e
                        });
                    })
                })
            });
        }
    }
});
</script>
<style scoped lang="less">
#pretty-hexo-theme-editor {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .editor {
        height: calc(100% - 50px);
    }

    .option {
        margin: 18px 16px 0 auto;
        display: flex;
        justify-content: right;
    }
}
</style>