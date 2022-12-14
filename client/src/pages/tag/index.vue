<template>
    <container-header>{{ $t('tag.title') }}</container-header>
    <container-main class="tag-page">
        <el-scrollbar>
            <div class="content">
                <div class="tag" v-for="(tag, index) in tagList" :key="index">
                    <div class="content">{{ tag.name }}</div>
                    <div class="count" v-if="tag.postCount > 0">
                        <el-icon style="vertical-align: -2px;">
                            <document/>
                        </el-icon>
                        <span style="margin-left: 8px;">{{ tag.postCount }}</span>
                    </div>
                    <div class="count" v-if="tag.pageCount > 0">
                        <el-icon style="vertical-align: -2px;">
                            <memo/>
                        </el-icon>
                        <span style="margin-left: 8px;">{{ tag.pageCount }}</span>
                    </div>
                    <div class="option" v-if="tag.postCount === 0">
                        <el-button type="primary" link :icon="edit" @click="tagUpdate(tag)"></el-button>
                        <el-button type="danger" link :icon="deleted" @click="tagDelete(tag)"></el-button>
                    </div>
                </div>
            </div>
        </el-scrollbar>
        <div class="tag-add">
            <el-button type="primary" circle :icon="plus" @click="tagAdd"></el-button>
        </div>
    </container-main>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Delete, Document, Edit, Memo, Plus, PriceTag} from '@element-plus/icons-vue';

import {tagService} from "@/global/BeanFactory";
import TagView from '@/views/TagView';
import {ElMessage, ElMessageBox} from "element-plus";
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";
import TagApi from "@/api/TagApi";

export default defineComponent({
    name: 'tag',
    components: {ContainerMain, ContainerHeader, PriceTag, Document, Memo},
    setup() {
        const plus = markRaw(Plus);
        const edit = markRaw(Edit);
        const deleted = markRaw(Delete);
        return {plus, edit, deleted}
    },
    data: () => ({
        tagList: new Array<TagView>()
    }),
    created() {
        this.tagListAll();
    },
    methods: {
        tagListAll() {
            TagApi.list().then((tags) => {
                this.tagList = tags;
            });
        },
        tagAdd() {
            ElMessageBox.prompt(this.$t('tag.add_tag_hint'), this.$t('tag.add_tag'), {
                confirmButtonText: this.$t('common.add'),
                cancelButtonText: this.$t('common.cancel'),
            }).then(({value}) => {
                tagService.insert(value).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: this.$t('hint.add_success'),
                    });
                    this.tagListAll();
                });
            });
        },
        tagUpdate(tag: TagView) {
            if (tag.postCount !== 0) {
                // ??????????????????0??????????????????
                return;
            }
            ElMessageBox.prompt(this.$t('tag.update_tag_hint'), this.$t('tag.update_tag'), {
                confirmButtonText: this.$t('common.update'),
                cancelButtonText: this.$t('common.cancel'),
                inputValue: tag.name
            }).then(({value}) => {
                TagApi.update(tag.id!, value).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: this.$t('hint.update_success'),
                    });
                    this.tagListAll();
                }).catch((e) => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: this.$t('hint.update_fail') + ',' + e,
                    });
                });
            });
        },
        tagDelete(tag: TagView) {
            if (tag.postCount !== 0) {
                // ??????????????????0??????????????????
                return;
            }
            ElMessageBox.confirm(
                this.$t('tag.delete_hint'),
                this.$t('common.warning'),
                {
                    confirmButtonText: this.$t('common.delete'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning',
                }
            ).then(() => {
                TagApi.deleteById(tag.id!).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: this.$t('hint.delete_success'),
                    });
                    this.tagListAll();
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: this.$t('hint.delete_fail') + ',' + e,
                    });
                })
            }).catch(() => {
                console.error("????????????")
            })
        }
    }
});
</script>
<style scoped lang="less">
.tag-page {
    padding: 20px;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .content {
        display: flex;
        flex-wrap: wrap;

        .tag {
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            display: flex;
            margin: 4px 6px;
            cursor: pointer;

            .content {
                padding: 2px 8px;
            }

            .count {
                padding: 2px 10px;
                background-color: #f5f7fa;
                border-left: 1px solid #dcdfe6;
            }

            .option {
                border-left: 1px solid #dcdfe6;
                padding: 0 10px;
                background-color: #f5f7fa;
            }

            &:hover {
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05);

            }

            // ?????? 4px #dcdfe6
            //    #f5f7fa
        }
    }

    .tag-add {
        position: absolute;
        right: 40px;
        bottom: 40px;
    }
}
</style>