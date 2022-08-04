<template>
    <div id="tag-page">
        <el-scrollbar>
            <div class="content">
                <div class="tag" v-for="(tag, index) in tagList" :key="index">
                    <div class="content">{{ tag.name }}</div>
                    <div class="count" v-if="tag.postCount > 0">{{ tag.postCount }}</div>
                    <div class="option" v-else>
                        <el-button type="primary" link :icon="edit" @click="tagUpdate(tag)"></el-button>
                        <el-button type="danger" link :icon="deleted" @click="tagDelete(tag)"></el-button>
                    </div>
                </div>
            </div>
        </el-scrollbar>
        <div class="tag-add">
            <el-button type="primary" circle :icon="plus" @click="tagAdd"></el-button>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Delete, Edit, Plus, PriceTag} from '@element-plus/icons-vue';

import {tagService} from "@/global/BeanFactory";
import TagView from '@/views/TagView';
import {ElMessage, ElMessageBox} from "element-plus";

export default defineComponent({
    name: 'tag',
    components: {PriceTag},
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
            tagService.list().then((tags) => {
                this.tagList = tags;
            });
        },
        tagAdd() {
            ElMessageBox.prompt('请输入标签名称', '新增标签', {
                confirmButtonText: '新增',
                cancelButtonText: '取消',
            }).then(({value}) => {
                tagService.insert(value).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: `新增成功`,
                    });
                    this.tagListAll();
                });
            }).catch(() => {
            });
        },
        tagUpdate(tag: TagView) {
            if (tag.postCount !== 0) {
                // 文章数量不为0，不允许修改
                return;
            }
            ElMessageBox.prompt('请输入标签名称', '修改标签', {
                confirmButtonText: '修改',
                cancelButtonText: '取消',
                inputValue: tag.name
            }).then(({value}) => {
                tagService.update(tag.id, value).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: `更新成功`,
                    });
                    this.tagListAll();
                }).catch((e) => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: `更新失败，` + e,
                    });
                });
            });
        },
        tagDelete(tag: TagView) {
            if (tag.postCount !== 0) {
                // 文章数量不为0，不允许修改
                return;
            }
            ElMessageBox.confirm(
                `此操作将永久删除标签【${tag.name}】. 是否继续?`,
                '警告',
                {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                tagService.removeById(tag.id!).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: '删除成功',
                    });
                    this.tagListAll();
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: e,
                    });
                })
            }).catch(() => {
                console.error("取消删除")
            })
        }
    }
});
</script>
<style scoped lang="less">
#tag-page {
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

            // 边框 4px #dcdfe6
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