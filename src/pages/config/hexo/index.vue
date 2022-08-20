<template>
    <!-- 面板 -->
    <container-header>
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$t('config.hexo.site.title')" name="site">
            </el-tab-pane>
            <el-tab-pane :label="$t('config.hexo.url.title')" name="url">
            </el-tab-pane>
            <el-tab-pane :label="$t('config.hexo.directory.title')" name="directory">
            </el-tab-pane>
            <el-tab-pane :label="$t('config.hexo.writing.title')" name="writing">
            </el-tab-pane>
            <el-tab-pane :label="$t('config.hexo.misc.title')" name="misc">
            </el-tab-pane>
            <el-tab-pane :label="$t('config.hexo.other.title')" name="other">
            </el-tab-pane>
            <el-tab-pane :label="$t('config.hexo.extra.title')" name="extra">
            </el-tab-pane>
            <el-tab-pane :label="$t('config.hexo.theme.title')" name="theme">
            </el-tab-pane>
        </el-tabs>
    </container-header>
    <container-main class="config-hexo">
        <el-scrollbar>
            <div v-if="blogIsInit">
                <el-form label-width="80px" v-if="activeName === 'site'">
                    <el-form-item :label="$t('config.hexo.site.title')">
                        <el-input v-model="hexo.title"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.site.subtitle')">
                        <el-input v-model="hexo.subtitle"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.site.description')">
                        <el-input v-model="hexo.description"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.site.keywords')">
                        <el-tag
                            v-for="keyword in hexo.keywords"
                            :key="keyword"
                            closable
                            :disable-transitions="false"
                            @close="keywordRemove(keyword)"
                            style="margin-right: 5px;"
                        >
                            {{ keyword }}
                        </el-tag>
                        <el-input
                            v-if="keywordInput"
                            ref="keywordInputRef"
                            v-model="keywordInputText"
                            size="small"
                            style="width: 72px;"
                            @keyup.enter="keywordAdd"
                            @blur="keywordAdd"
                        />
                        <el-button v-else size="small" @click="showKeywordInput">
                            {{ $t('config.hexo.site.new_keyword') }}
                        </el-button>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.site.author')">
                        <el-input v-model="hexo.author"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.site.language')">
                        <el-autocomplete v-model="hexo.language" :fetch-suggestions="languageSuggestion" clearable
                                         @select="languageSelect">
                            <template v-slot="{ item }">
                                <span>{{ item }}</span>
                            </template>
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.site.timezone')">
                        <el-autocomplete v-model="hexo.timezone" :fetch-suggestions="timezoneSuggestion" clearable
                                         @select="timezoneSelect">
                            <template v-slot="{ item }">
                                <span>{{ item }}</span>
                            </template>
                        </el-autocomplete>
                    </el-form-item>
                </el-form>
                <el-form label-width="120px" v-else-if="activeName === 'url'">
                    <el-form-item :label="$t('config.hexo.url.url')">
                        <el-input v-model="hexo.url" :placeholder="$t('config.hexo.url.placeholder.url')"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.url.root')">
                        <el-input v-model="hexo.root" :placeholder="$t('config.hexo.url.placeholder.root')"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.url.permalink')">
                        <el-input v-model="hexo.permalink" :placeholder="$t('config.hexo.url.placeholder.permalink')"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.url.permalink_defaults')">
                        <el-input v-model="hexo.permalink_defaults"
                                  :placeholder="$t('config.hexo.url.placeholder.permalink_defaults')"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.url.trailing_html')">
                        <el-switch v-model="hexo.pretty_urls.trailing_html" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.url.trailing_index')">
                        <el-switch v-model="hexo.pretty_urls.trailing_index" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                </el-form>
                <el-form label-width="160px" v-else-if="activeName === 'directory'">
                    <el-form-item :label="$t('config.hexo.directory.source_dir')">
                        <el-input v-model="hexo.source_dir"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.directory.public_dir')">
                        <el-input v-model="hexo.public_dir"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.directory.tag_dir')">
                        <el-input v-model="hexo.tag_dir"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.directory.archive_dir')">
                        <el-input v-model="hexo.archive_dir"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.directory.category_dir')">
                        <el-input v-model="hexo.category_dir"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.directory.code_dir')">
                        <el-input v-model="hexo.code_dir"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.directory.i18n_dir')">
                        <el-input v-model="hexo.i18n_dir"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.directory.skip_render')">
                        <el-input v-model="hexo.skip_render"/>
                    </el-form-item>
                </el-form>
                <el-form label-width="160px" v-else-if="activeName === 'writing'">
                    <el-form-item :label="$t('config.hexo.writing.new_post_name')">
                        <el-input v-model="hexo.new_post_name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.writing.default_layout')">
                        <el-input v-model="hexo.default_layout"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.writing.auto_spacing')">
                        <el-switch v-model="hexo.auto_spacing" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.writing.titlecase')">
                        <el-switch v-model="hexo.titlecase" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.writing.external_link.enable')">
                        <el-switch v-model="hexo.external_link.enable" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.writing.external_link.field')"
                                  v-if="hexo.external_link.enable">
                        <el-select v-model="hexo.external_link.field">
                            <el-option :label="$t('config.hexo.writing.site')" value="site"/>
                            <el-option :label="$t('config.hexo.writing.post')" value="post"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.writing.filename_case.tiitle')">
                        <el-select v-model="hexo.filename_case">
                            <el-option :label="$t('config.hexo.writing.filename_case.no')" :value="0"/>
                            <el-option :label="$t('config.hexo.writing.filename_case.lowercase')" :value="1"/>
                            <el-option :label="$t('config.hexo.writing.filename_case.uppercase')" :value="2"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.writing.render_drafts')">
                        <el-switch v-model="hexo.render_drafts" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.writing.post_asset_folder')">
                        <el-switch v-model="hexo.post_asset_folder" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.writing.relative_link')">
                        <el-switch v-model="hexo.relative_link" active-text="true" inactive-text="false"
                                   :active-value="true" :inactive-value="false"/>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.writing.future')">
                        <el-switch v-model="hexo.future" active-text="true" inactive-text="false"
                                   :active-value="true"
                                   :inactive-value="false"/>
                    </el-form-item>
                </el-form>
                <el-form label-width="120px" v-else-if="activeName === 'misc'">
                    <!-- 分类 & 标签 -->
                    <el-divider content-position="left">{{ $t('config.hexo.misc.category_and_tag.title') }}</el-divider>
                    <el-form-item :label="$t('config.hexo.misc.category_and_tag.default_category')">
                        <el-input v-model="hexo.default_category"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.misc.category_and_tag.category_map')">
                        <el-input v-model="hexo.category_map"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.misc.category_and_tag.tag_map')">
                        <el-input v-model="hexo.tag_map"></el-input>
                    </el-form-item>
                    <!-- 日期 / 时间格式 -->
                    <el-divider content-position="left">{{ $t('config.hexo.misc.date_format.title') }}</el-divider>
                    <el-form-item :label="$t('config.hexo.misc.date_format.date_format')">
                        <el-input v-model="hexo.date_format"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.misc.date_format.time_format')">
                        <el-input v-model="hexo.time_format"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.misc.date_format.updated_option.title')">
                        <el-select v-model="hexo.updated_option">
                            <el-option :label="$t('config.hexo.misc.date_format.updated_option.mtime')" value="mtime"/>
                            <el-option :label="$t('config.hexo.misc.date_format.updated_option.date')" value="date"/>
                            <el-option :label="$t('config.hexo.misc.date_format.updated_option.empty')" value="empty"/>
                        </el-select>
                    </el-form-item>
                    <!-- 分页 -->
                    <el-divider content-position="left">{{ $t('config.hexo.pagination.title') }}</el-divider>
                    <el-form-item :label="$t('config.hexo.pagination.per_page')">
                        <el-input-number controls-position="right" v-model="hexo.per_page"></el-input-number>
                    </el-form-item>
                    <el-form-item :label="$t('config.hexo.pagination.pagination_dir')">
                        <el-input v-model="hexo.pagination_dir" style="width: 150px;">
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-form label-width="120px" v-else-if="activeName === 'other'">
                    <el-form-item :label="$t('config.hexo.other.theme')">
                        <el-select v-model="hexo.theme">
                            <el-option v-for="theme of themeList" :key="theme" :label="theme" :value="theme"/>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <el-empty style="margin-top: 20vh;" v-else :description="$t('hint.blog_not_init')"/>
            <div id="extra" v-if="activeName === 'extra' && blogIsInit" style="height: calc(100vh - 190px);">
                <hexo-config-editor v-model="extra"></hexo-config-editor>
            </div>
            <div id="theme" v-if="activeName === 'theme' && blogIsInit" style="height: calc(100vh - 190px);">
                <theme-config-editor v-model="theme"></theme-config-editor>
            </div>
            <div style="text-align: right;padding: 20px;" v-if="blogIsInit">
                <el-button type="primary" @click="save" v-if="activeName !== 'theme'">{{ $t('common.save') }}
                </el-button>
                <el-button type="primary" @click="saveTheme" v-else>{{ $t('common.save') }}</el-button>
            </div>
        </el-scrollbar>
    </container-main>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {ElMessage, TabsPaneContext} from "element-plus";

import Hexo from "@/global/config/Hexo";
import FileApi from "@/api/FileApi";
import Constant from "@/global/Constant";

import HexoConfigEditor from "@/components/HexoConfigEditor/index.vue";
import ThemeConfigEditor from "@/components/ThemeConfigEditor/index.vue";
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";

import languages from './components/languages';
import timezones from './components/timezones';
import ArrayUtil from "@/utils/ArrayUtil";
import blogStrategyContext from "@/strategy/blog/BlogStrategyContext";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";

export default defineComponent({
    components: {ContainerMain, ContainerHeader, HexoConfigEditor, ThemeConfigEditor},
    data: () => ({
        // 基础配置
        hexo: new Hexo(),
        // 额外配置
        extra: '',
        // 主题配置
        theme: "",
        activeName: 'site',
        themeList: new Array<string>(),
        keywordInput: false,
        keywordInputText: "",
        blogIsInit: false,
    }),
    created() {
        blogStrategyContext.getStrategy().isInit().then(isInit => {
            this.blogIsInit = isInit;
            if (isInit) {
                // 配置初始化
                this.configInit();
                // 查询博客主题
                this.themeInit();
                // 增加快捷键
                this.addKeyCode();
            }
        })
    },
    unmounted() {
        document.onkeydown = null;
    },
    methods: {
        configInit() {
            // 主配置
            Constant.FILE.HEXO_CONFIG_BASE().then(path => {
                FileApi.readFile(path).then(content => {
                    this.hexo.parse(content);
                    Constant.FOLDER.HEXO.BASE().then(hexoPath => {
                        // 主题配置
                        FileApi.resolve(hexoPath, `_config.${this.hexo.theme}.yml`).then(themePath => {
                            FileApi.readFile(themePath).then(themeContent => {
                                this.theme = themeContent;
                            }).catch((e) => {
                                console.error('不存在目录', e);
                            })
                        })
                    });
                });
            });
            // 额外配置
            Constant.FILE.HEXO_CONFIG_EXTRA().then(path => {
                FileApi.readFile(path).then(content => {
                    if (content) {
                        this.extra = content;
                    }
                }).catch((e) => {
                    console.error('不存在目录', e);
                })
            })
        },
        themeInit() {
            Constant.FOLDER.HEXO.THEME().then(path => {
                FileApi.listDir(path).then(files => {
                    for (let file of files) {
                        if (file.children) {
                            this.themeList.push(file.name!);
                        }
                    }
                });
            });
        },
        addKeyCode: function () {
            document.onkeydown = (e) => {
                // 各种快捷键
                if (e.ctrlKey) {
                    if (e.code == 'KeyS') {
                        if (this.activeName === 'theme') {
                            this.saveTheme();
                        } else {
                            this.save();
                        }
                    }
                }
            }
        },
        showKeywordInput() {
            this.keywordInput = true;
            this.keywordInputText = "";
            this.$nextTick(() => {
                let keywordInputRef = this.$refs.keywordInputRef as HTMLElement;
                keywordInputRef.focus();
            })
        },
        keywordAdd() {
            if (this.keywordInputText !== "" && !ArrayUtil.contains(this.hexo.keywords, this.keywordInputText)) {
                try {
                    this.hexo.keywords.push(this.keywordInputText);
                } catch (e) {
                    console.error(e);
                    this.hexo.keywords = [this.keywordInputText];
                }
            }
            this.keywordInput = false;
            this.keywordInputText = "";
        },
        keywordRemove(keyword: string) {
            let deleteIndex = this.hexo.keywords.indexOf(keyword);
            this.hexo.keywords.splice(deleteIndex, 1);
        },
        languageSuggestion(keyword: string, cb: any) {
            if (keyword && keyword !== '') {
                cb(languages.filter(item => {
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
                    return item.indexOf(keyword) > -1;
                }))
            } else {
                cb(timezones)
            }
        },
        timezoneSelect(item: string) {
            this.hexo.timezone = item;
        },
        async save() {
            let hexoUrl = this.hexo.url;
            if (!hexoUrl || hexoUrl === '') {
                ElMessage({
                    showClose: false,
                    type: 'warning',
                    message: this.$t('config.hexo.url.require')
                });
                return;
            }
            // 读取相关目录与内容
            let hexoConfigBase = await Constant.FILE.HEXO_CONFIG_BASE();
            let hexoConfigExtra = await Constant.FILE.HEXO_CONFIG_EXTRA();
            let hexoConfig = await Constant.FILE.HEXO.CONFIG();
            let baseConfig = this.hexo.render();
            let extraConfig = this.extra;
            try {
                console.log(extraConfig)
                // 在写入文件
                await FileApi.writeFile(hexoConfigBase, baseConfig);
                await FileApi.writeFile(hexoConfigExtra, extraConfig);
                await FileApi.writeFile(hexoConfig, "# 基础属性\n\n" + baseConfig + '\n# 拓展属性\n\n' + extraConfig);
                ElMessage({
                    showClose: true,
                    message: this.$t('hint.save_success'),
                    type: 'success',
                })
                emitter.emit(MessageEventEnum.CONFIG_UPDATE);
            } catch (e) {
                ElMessage({
                    showClose: true,
                    message: this.$t('hint.save_fail') + ',' + e,
                    type: 'error',
                })
            }
        },
        saveTheme() {
            Constant.FOLDER.HEXO.BASE().then(hexoPath => {
                FileApi.resolve(hexoPath, `_config.${this.hexo.theme}.yml`).then(themePath => {
                    FileApi.writeFile(themePath, this.theme).then(() => {
                        ElMessage({
                            showClose: true,
                            message: this.$t('hint.theme_save_success'),
                            type: 'success',
                        })
                        emitter.emit(MessageEventEnum.CONFIG_UPDATE);
                    }).catch((e) => {
                        ElMessage({
                            showClose: true,
                            message: this.$t('hint.theme_save_fail') + ',' + e,
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
.config-hexo {
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