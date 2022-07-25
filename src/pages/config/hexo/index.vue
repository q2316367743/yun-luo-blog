<template>
    <!-- 面板 -->
    <el-tabs v-model="activeName" class="demo-tabs" id="config-hexo">
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
                        :reserve-keyword="false" placeholder="网站的关键词。支持多个关键词。" style="width: 300px">
                        <el-option v-for="item in hexo.keywords" :key="item" :label="item" :value="item" />
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
                    <el-input v-model="hexo.url" placeholder="网址, 必须以 http:// 或 https:// 开头" />
                </el-form-item>
                <el-form-item label="根目录">
                    <el-input v-model="hexo.root" placeholder="网站根目录" />
                </el-form-item>
                <el-form-item label="永久链接">
                    <el-input v-model="hexo.permalink" placeholder="文章的 永久链接 格式" />
                </el-form-item>
                <el-form-item label="永久链接默认值">
                    <el-input v-model="hexo.permalink_defaults" placeholder="永久链接中各部分的默认值" />
                </el-form-item>
                <el-form-item label="保留index.html">
                    <el-switch v-model="hexo.pretty_urls.trailing_html" active-text="true" inactive-text="false"
                        :active-value="true" :inactive-value="false" />
                </el-form-item>
                <el-form-item label="保留.html">
                    <el-switch v-model="hexo.pretty_urls.trailing_index" active-text="true" inactive-text="false"
                        :active-value="true" :inactive-value="false" />
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="目录" name="directory">
            <el-form label-width="160px">
                <el-form-item label="资源文件夹">
                    <el-input v-model="hexo.source_dir" />
                </el-form-item>
                <el-form-item label="公共文件夹">
                    <el-input v-model="hexo.public_dir" />
                </el-form-item>
                <el-form-item label="标签文件夹">
                    <el-input v-model="hexo.tag_dir" />
                </el-form-item>
                <el-form-item label="归档文件夹">
                    <el-input v-model="hexo.archive_dir" />
                </el-form-item>
                <el-form-item label="分类文件夹">
                    <el-input v-model="hexo.category_dir" />
                </el-form-item>
                <el-form-item label="Include code 文件夹">
                    <el-input v-model="hexo.code_dir" />
                </el-form-item>
                <el-form-item label="国际化（i18n）文件夹">
                    <el-input v-model="hexo.i18n_dir" />
                </el-form-item>
                <el-form-item label="跳过指定文件的渲染">
                    <el-input v-model="hexo.skip_render" />
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="分类 & 标签" name="category_and_tag">Task</el-tab-pane>
        <el-tab-pane label="日期 / 时间格式" name="date_time_format">Role</el-tab-pane>
        <el-tab-pane label="分页" name="pagination">Role</el-tab-pane>
        <el-tab-pane label="拓展" name="extensions">Role</el-tab-pane>
    </el-tabs>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Hexo from "@/global/config/Hexo";
import FileUtil from "@/utils/FileUtil";
import constant from "@/global/constant";

import languages from './components/languages';
import timezones from './components/timezones';

export default defineComponent({
    data: () => ({
        hexo: new Hexo(),
        activeName: 'site'
    }),
    created() {
        FileUtil.readFile(constant.PATH.HEXO_CONFIG).then(content => {
            this.hexo = new Hexo(content);
        })
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

    .el-autocomplete {
        .el-input {
            width: 300px;
        }
    }
}
</style>