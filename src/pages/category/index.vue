<template>
    <div id="category">
        <el-tree :data="categoryTree" :props="categoryProps" default-expand-all>
            <template #default="{ node, data }">
                <div style="display: flex;justify-content: space-between;width: 100%;">
                    <div>
                        <span>{{ node.label }}</span>
                        <span v-if="data.postCount > 0">({{ data.postCount }})</span>
                    </div>
                    <div>
                        <el-button type="primary" link @click.stop="categoryAdd(data.id)">新增子分类</el-button>
                        <el-button type="danger" link :disabled="data.children.length > 0 || data.postCount > 0"
                                   @click="categoryRemove(data.id)">
                            删除
                        </el-button>
                    </div>
                </div>
            </template>
        </el-tree>
        <div class="category-add">
            <el-button type="primary" circle :icon="plus" @click="categoryAdd(0)"></el-button>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Plus} from '@element-plus/icons-vue';

import {categoryService} from "@/global/BeanFactory";
import CategoryView from "@/views/CategoryView";
import {ElMessage, ElMessageBox} from "element-plus";

export default defineComponent({
    name: 'category',
    setup() {
        const plus = markRaw(Plus);
        return {plus}
    },
    data: () => ({
        categoryProps: {
            label: 'name',
        },
        categoryTree: new Array<CategoryView>()
    }),
    created() {
        this.categoryList();
    },
    methods: {
        categoryList() {
            categoryService.list().then(categoryTree => {
                this.categoryTree = categoryTree;
            })
        },
        categoryAdd(id: number) {
            ElMessageBox.prompt('请输入分类名称', '新增分类', {
                confirmButtonText: '新增',
                cancelButtonText: '取消',
            }).then(({value}) => {
                categoryService.insert({
                    name: value,
                    parentId: id
                }).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: `新增成功`,
                    });
                    this.categoryList();
                });
            }).catch(() => {
            });
        },
        categoryRemove(id: number) {
            ElMessageBox.confirm(
                '此操作将永远删除此分类，是否继续？',
                'Warning',
                {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                categoryService.removeById(id).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: '成功删除分类',
                    });
                    this.categoryList();
                }).catch((e) => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '删除失败，' + e,
                    });
                })
            }).catch(() => {
            })
        }
    }
});
</script>
<style scoped lang="less">
#category {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20px;

    .category-add {
        position: absolute;
        right: 40px;
        bottom: 40px;
    }
}
</style>