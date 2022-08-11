<template>
    <div id="container-header">
        <p style="line-height: 40px;padding: 0 20px">{{ $t('category.title') }}</p>
    </div>
    <div id="container-main" class="category">
        <el-scrollbar>
            <el-tree :data="categoryTree" :props="categoryProps" default-expand-all>
                <template #default="{ node, data }">
                    <div style="display: flex;justify-content: space-between;width: 100%;">
                        <div>
                            <span>{{ node.label }}</span>
                            <span v-if="data.postCount > 0" v-text="'()' + data.postCount + ')'"></span>
                        </div>
                        <div>
                            <el-button type="primary" link @click.stop="categoryAdd(data.id)">
                                {{ $t('category.addSubCategory') }}</el-button>
                            <el-button type="danger" link :disabled="data.children.length > 0 || data.postCount > 0"
                                @click="categoryRemove(data.id)">{{ $t('common.delete') }}</el-button>
                        </div>
                    </div>
                </template>
            </el-tree>
        </el-scrollbar>
        <div class="category-add">
            <el-button type="primary" circle :icon="plus" @click="categoryAdd(0)"></el-button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, markRaw } from "vue";
import { Plus } from '@element-plus/icons-vue';

import { categoryService } from "@/global/BeanFactory";
import CategoryView from "@/views/CategoryView";
import { ElMessage, ElMessageBox } from "element-plus";

export default defineComponent({
    name: 'category',
    setup() {
        const plus = markRaw(Plus);
        return { plus }
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
            ElMessageBox.prompt(this.$t('category.addCategoryHint'), this.$t('category.addCategory'), {
                confirmButtonText: this.$t('common.add'),
                cancelButtonText: this.$t('common.cancel'),
            }).then(({ value }) => {
                categoryService.insert({
                    name: value,
                    parentId: id
                }).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: this.$t('hint.addSuccess'),
                    });
                    this.categoryList();
                });
            }).catch((e) => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: this.$t('hint.addFail') + ',' + e,
                });
            });
        },
        categoryRemove(id: number) {
            ElMessageBox.confirm(
                this.$t('category.deleteCategoryHint'),
                this.$t('common.warning'),
                {
                    confirmButtonText: this.$t('common.delete'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning',
                }
            ).then(() => {
                categoryService.removeById(id).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: this.$t('hint.deleteSuccess'),
                    });
                    this.categoryList();
                }).catch((e) => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: this.$t('hint.deleteFail') + ',' + e,
                    });
                })
            }).catch(() => {
            })
        }
    }
});
</script>
<style scoped lang="less">
.category {
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