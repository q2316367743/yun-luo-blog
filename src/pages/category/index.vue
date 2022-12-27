<template>
    <container-header>
        {{ $t('category.title') }}
    </container-header>
    <container-main class="category">
        <el-scrollbar>
            <el-tree :data="categoryTree" :props="categoryProps" default-expand-all>
                <template #default="{ node, data }">
                    <div style="display: flex;justify-content: space-between;width: 100%;">
                        <div>
                            <span>{{ node.label }}</span>
                            <span v-if="data.postCount > 0">
                                <span>(</span>
                                <el-icon style="vertical-align: -2px;"><document/></el-icon>
                                <span>{{ data.postCount }}</span>
                                <span>)</span>
                            </span>
                            <span v-if="data.pageCount > 0">
                                <span>(</span>
                                <el-icon style="vertical-align: -2px;"><memo/></el-icon>
                                <span>{{ data.pageCount }}</span>
                                <span>)</span>
                            </span>
                        </div>
                        <div>
                            <el-button type="primary" link @click.stop="categoryAdd(data.id)">
                                {{ $t('category.add_sub_category') }}
                            </el-button>
                            <el-button type="danger" link :disabled="data.children.length > 0 || data.postCount > 0 || data.pageCount > 0"
                                       @click="categoryRemove(data.id)">{{ $t('common.delete') }}
                            </el-button>
                        </div>
                    </div>
                </template>
            </el-tree>
        </el-scrollbar>
        <div class="category-add">
            <el-button type="primary" circle :icon="plus" @click="categoryAdd(0)"></el-button>
        </div>
    </container-main>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Document, Memo, Plus} from '@element-plus/icons-vue';

import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";

import {categoryService} from "@/global/BeanFactory";
import CategoryView from "@/views/CategoryView";
import {ElMessage, ElMessageBox} from "element-plus";
import CategoryApi from "@/api/CategoryApi";

export default defineComponent({
    name: 'category',
    components: {ContainerMain, ContainerHeader, Document, Memo},
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
            CategoryApi.list().then(categoryTree => {
                this.categoryTree = categoryTree;
            });
        },
        categoryAdd(id: number) {
            ElMessageBox.prompt(this.$t('category.add_category_hint'), this.$t('category.add_category'), {
                confirmButtonText: this.$t('common.add'),
                cancelButtonText: this.$t('common.cancel'),
            }).then(({value}) => {
                categoryService.insert({
                    name: value,
                    parentId: id
                }).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: this.$t('hint.add_success'),
                    });
                    this.categoryList();
                });
            }).catch((e) => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: this.$t('hint.add_fail') + ',' + e,
                });
            });
        },
        categoryRemove(id: number) {
            ElMessageBox.confirm(
                this.$t('category.delete_category_hint'),
                this.$t('common.warning'),
                {
                    confirmButtonText: this.$t('common.delete'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning',
                }
            ).then(() => {
                CategoryApi.deleteById(id).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: this.$t('hint.delete_success'),
                    });
                    this.categoryList();
                }).catch((e) => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: this.$t('hint.delete_fail') + ',' + e,
                    });
                })
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