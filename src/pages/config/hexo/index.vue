<template>
    <!-- 面板 -->
    <div id="config-hexo">
        <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="网站" name="site">
                <el-form label-width="80px">
                    <el-form-item label="标题">
                        <el-input v-model="hexo.title"></el-input>
                    </el-form-item>
                    <el-form-item label="副标题">
                        <el-input v-model="hexo.subtitle"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input v-model="hexo.description"></el-input>
                    </el-form-item>
                    <el-form-item label="关键词">
                        <el-select v-model="hexo.keywords" multiple filterable allow-create default-first-option
                                   :reserve-keyword="false" placeholder="网站的关键词。支持多个关键词。"
                                   style="width: 300px">
                            <el-option v-for="item in hexo.keywords" :key="item" :label="item" :value="item"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="您的昵称">
                        <el-input v-model="hexo.author"></el-input>
                    </el-form-item>
                    <el-form-item label="语言">
                        <el-autocomplete v-model="hexo.language" :fetch-suggestions="languageSuggestion" clearable
                                         @select="languageSelect">
                            <template v-slot="{ item }">
                                <span>{{ item }}</span>
                            </template>
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item label="时区">
                        <el-autocomplete v-model="hexo.timezone" :fetch-suggestions="timezoneSuggestion" clearable
                                         @select="timezoneSelect">
                            <template v-slot="{ item }">
                                <span>{{ item }}</span>
                            </template>
                        </el-autocomplete>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="网址" name="url">
                <el-form label-width="120px">
                    <el-form-item label="URL">
                        <!--suppress HttpUrlsUsage -->
                        <el-input v-model="hexo.url" placeholder="网址, 必须以 http:// 或 https:// 开头"/>
                    </el-form-item>
                    <el-form-item label="根目录">
                        <el-input v-model="hexo.root" placeholder="网站根目录"/>
                    </el-form-item>
                    <el-form-item label="永久链接">
                        <el-input v-model="hexo.permalink" placeholder="文章的 永久链接 格式"/>
                    </el-form-item>
                    <el-form-item label="永久链接默认值">
                        <el-input v-model="hexo.permalink_defaults" placeholder="永久链接中各部分的默认值"/>
                    </el-form-item>
                    <el-form-item label="保留index.html">
                        <el-switch v-model="hexo.pretty_urls.trailing_html" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item label="保留.html">
                        <el-switch v-model="hexo.pretty_urls.trailing_index" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="目录" name="directory">
                <el-form label-width="160px">
                    <el-form-item label="资源文件夹">
                        <el-input v-model="hexo.source_dir"/>
                    </el-form-item>
                    <el-form-item label="公共文件夹">
                        <el-input v-model="hexo.public_dir"/>
                    </el-form-item>
                    <el-form-item label="标签文件夹">
                        <el-input v-model="hexo.tag_dir"/>
                    </el-form-item>
                    <el-form-item label="归档文件夹">
                        <el-input v-model="hexo.archive_dir"/>
                    </el-form-item>
                    <el-form-item label="分类文件夹">
                        <el-input v-model="hexo.category_dir"/>
                    </el-form-item>
                    <el-form-item label="Include code 文件夹">
                        <el-input v-model="hexo.code_dir"/>
                    </el-form-item>
                    <el-form-item label="国际化（i18n）文件夹">
                        <el-input v-model="hexo.i18n_dir"/>
                    </el-form-item>
                    <el-form-item label="跳过指定文件的渲染">
                        <el-input v-model="hexo.skip_render"/>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="写作" name="writing">
                <el-form label-width="160px">
                    <el-form-item label="新文章的文件名称">
                        <el-input v-model="hexo.new_post_name"></el-input>
                    </el-form-item>
                    <el-form-item label="预设布局">
                        <el-input v-model="hexo.default_layout"></el-input>
                    </el-form-item>
                    <el-form-item label="中英文之间加入空格">
                        <el-switch v-model="hexo.auto_spacing" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item label="把标题转换为title case">
                        <el-switch v-model="hexo.titlecase" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item label="新标签中打开链接">
                        <el-switch v-model="hexo.external_link.enable" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item label="生效范围" v-if="hexo.external_link.enable">
                        <el-select v-model="hexo.external_link.field">
                            <el-option label="整个网站" value="site"/>
                            <el-option label="文章" value="post"/>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="排除的域名">
                    <el-input v-model="hexo.external_link.exclude"></el-input>
                </el-form-item> -->
                    <el-form-item label="文件名称转换">
                        <el-select v-model="hexo.filename_case">
                            <el-option label="不转换" :value="0"/>
                            <el-option label="小写" :value="1"/>
                            <el-option label="大写" :value="2"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="显示草稿">
                        <el-switch v-model="hexo.render_drafts" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item label="启动 Asset 文件夹">
                        <el-switch v-model="hexo.post_asset_folder" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item label="相对位址">
                        <el-switch v-model="hexo.relative_link" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item label="显示未来的文章">
                        <el-switch v-model="hexo.future" active-text="true" inactive-text="false" :active-value="true"
                                   :inactive-value="false"/>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="分类 & 标签" name="category_and_tag">
                <el-form label-width="80px">
                    <el-form-item label="默认分类">
                        <el-input v-model="hexo.default_category"></el-input>
                    </el-form-item>
                    <el-form-item label="分类别名">
                        <el-input v-model="hexo.category_map"></el-input>
                    </el-form-item>
                    <el-form-item label="标签别名">
                        <el-input v-model="hexo.tag_map"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="日期 / 时间格式" name="date_time_format">
                <el-form label-width="120px">
                    <el-form-item label="日期格式">
                        <el-input v-model="hexo.date_format"></el-input>
                    </el-form-item>
                    <el-form-item label="时间格式">
                        <el-input v-model="hexo.time_format"></el-input>
                    </el-form-item>
                    <el-form-item label="默认更新时间">
                        <el-select v-model="hexo.updated_option">
                            <el-option label="mtime" value="mtime"/>
                            <el-option label="date" value="date"/>
                            <el-option label="empty" value="empty"/>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="分页" name="pagination">
                <el-form label-width="120px">
                    <el-form-item label="每页数量">
                        <el-input-number controls-position="right" v-model="hexo.per_page"></el-input-number>
                    </el-form-item>
                    <el-form-item label="分页目录">
                        <el-input v-model="hexo.pagination_dir" style="width: 150px;">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="拓展" name="extensions">
                <el-form label-width="120px">
                    <el-form-item label="主题">
                        <el-select v-model="hexo.theme">
                            <el-option v-for="theme of themeList" :key="theme" :label="theme" :value="theme"/>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="源码" name="code">
            </el-tab-pane>
            <el-tab-pane label="主题配置" name="theme">
            </el-tab-pane>
        </el-tabs>
        <div id="code" v-if="activeName === 'code'" style="height: calc(100% - 110px);">
            <hexo-config-editor v-model="hexo.content"></hexo-config-editor>
        </div>
        <div id="theme" v-if="activeName === 'theme'" style="height: calc(100% - 110px);">
            <theme-config-editor v-model="theme"></theme-config-editor>
        </div>
        <div style="text-align: right;padding: 20px;">
            <el-button type="primary" @click="save" v-if="activeName !== 'theme'">保存</el-button>
            <el-button type="primary" @click="saveTheme" v-else>保存</el-button>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {ElMessage, TabsPaneContext} from "element-plus";

import Hexo from "@/global/config/Hexo";
import FileUtil from "@/utils/FileUtil";
import Constant from "@/global/Constant";
import HexoConfigEditor from "@/components/HexoConfigEditor/index.vue";
import ThemeConfigEditor from "@/components/ThemeConfigEditor/index.vue";

import languages from './components/languages';
import timezones from './components/timezones';

export default defineComponent({
    components: {HexoConfigEditor, ThemeConfigEditor},
    data: () => ({
        hexo: new Hexo(),
        theme: "",
        activeName: 'site',
        themeList: new Array<string>()
    }),
    created() {
        Constant.PATH.HEXO_CONFIG().then(path => {
            FileUtil.readFile(path).then(content => {
                this.hexo.parse(content);
                // 解析后尝试解析
                Constant.PATH.HEXO().then(hexoPath => {
                    // 读取文件内容
                    FileUtil.resolve(hexoPath, `_config.${this.hexo.theme}.yaml`).then(themePath => {
                        FileUtil.readFile(themePath).then(themeContent => {
                            this.theme = themeContent;
                        }).catch((e) => {
                            console.error('不存在目录', e);
                        })
                    })
                })
            });
        });
        Constant.PATH.HEXO_THEME().then(path => {
            FileUtil.listDir(path).then(files => {
                for (let file of files) {
                    if (file.children) {
                        this.themeList.push(file.name!);
                    }
                }
            });
        });
    },
    mounted() {
        document.onkeydown = (e) => {
            // 各种快捷键
            if (e.ctrlKey) {
                if (e.code == 'KeyS') {
                    if (this.activeName === 'theme') {
                        this.saveTheme();
                    }else {
                        this.save();
                    }
                }
            }
        }
    },
    unmounted() {
        document.onkeydown = null;
    },
    methods: {
        languageSuggestion(keyword: string, cb: any) {
            if (keyword && keyword !== '') {
                cb(languages.filter(item => {
                    console.log(item, keyword)
                    return item.indexOf(keyword) > -1;
                }))
            } else {
                cb(languages)
            }
        },
        languageSelect(item: string) {
            this.hexo.language = item;
        },
        timezoneSuggestion(keyword: string, cb: any) {
            if (keyword && keyword !== '') {
                // 有关键字
                cb(timezones.filter(item => {
                    console.log(item, keyword)
                    return item.indexOf(keyword) > -1;
                }))
            } else {
                console.log(timezones)
                cb(timezones)
            }
        },
        timezoneSelect(item: string) {
            this.hexo.timezone = item;
        },
        save() {
            Constant.PATH.HEXO_CONFIG().then(path => {
                FileUtil.writeFile(path, this.hexo.render()).then(() => {
                    ElMessage({
                        showClose: true,
                        message: '保存成功',
                        type: 'success',
                    })
                }).catch((e) => {
                    ElMessage({
                        showClose: true,
                        message: "保存失败，" + e,
                        type: 'error',
                    })
                });
            })
        },
        tabClick(tab: TabsPaneContext) {
            if (tab.props.name === 'code') {
                this.hexo.render();
            }
        },
        saveTheme() {
            Constant.PATH.HEXO().then(hexoPath => {
                FileUtil.resolve(hexoPath, `_config.${this.hexo.theme}.yaml`).then(themePath => {
                    FileUtil.writeFile(themePath, this.theme).then(() => {
                        ElMessage({
                            showClose: true,
                            message: '保存成功',
                            type: 'success',
                        })
                    }).catch((e) => {
                        ElMessage({
                            showClose: true,
                            message: "保存失败，" + e,
                            type: 'error',
                        })
                    });
                })
            })
        }
    }
});
</script>
<style lang="less">
#config-hexo {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 15px;

    .el-input {
        width: 300px;
    }

    .el-input-number {
        .el-input {
            width: 150px;
        }
    }

    .el-autocomplete {
        .el-input {
            width: 300px;
        }
    }
}
</style>