<template>
    <div id="tag-page">
        <div class="tag" v-for="(tag, index) in tagList" :key="index">
            <span>{{ tag }}</span>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { PriceTag } from '@element-plus/icons-vue';

import { tagService } from "@/global/BeanFactory";
import TagView from '@/views/TagView';

export default defineComponent({
    name: 'tag',
    components: { PriceTag },
    data: () => ({
        tagList: new Array<TagView>()
    }),
    created() {
        tagService.list().then(tags => {
            this.tagList = tags;
        })
    }
});
</script>
<style scoped lang="less">
#tag-page {
    display: flex;
    padding: 20px;

    .tag {
        border: #e8e8e8 solid 1px;
        margin: 4px 6px;
        padding: 8px;
        border-radius: 15px;
        font-size: 0.8em;
        cursor: pointer;

        &:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05);
        }
    }
}
</style>