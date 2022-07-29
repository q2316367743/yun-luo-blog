<template>
    <div id="category">
        <el-tree :data="categoryTree" :props="categoryProps" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import {categoryService} from "@/global/BeanFactory";
import CategoryView from "@/views/CategoryView";

export default defineComponent({
    name: 'theme-list',
    data: () => ({
        categoryProps: {
            label: 'name',
        },
        categoryTree: new Array<CategoryView>()
    }),
    created() {
        categoryService.list().then(categoryTree => {
            this.categoryTree = categoryTree;
        })
    }
});
</script>
<style scoped>
#category {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20px;
}
</style>