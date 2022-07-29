<template>
    <div id="tag-page">
        <el-scrollbar>
            <div class="content">
                <el-popover
                    v-for="(tag, index) in tagList" :key="index"
                    ref="popover"
                    :width="200"
                    trigger="contextmenu"
                >
                    <template #reference>
                        <div class="tag">
                            <el-badge :value="tag.postCount">
                                <span>{{ tag.name }}</span>
                            </el-badge>
                        </div>
                    </template>
                    <div>
                        <el-button type="primary" text @click="tagUpdate(tag)" :disabled="tag.postCount !== 0">修改
                        </el-button>
                    </div>
                    <div>
                        <el-button type="danger" text>删除</el-button>
                    </div>
                </el-popover>
            </div>
        </el-scrollbar>
        <div class="tag-add">
            <el-button type="primary" circle :icon="plus" @click="tagAdd"></el-button>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {PriceTag, Plus} from '@element-plus/icons-vue';

import {tagService} from "@/global/BeanFactory";
import TagView from '@/views/TagView';
import {ElMessage, ElMessageBox} from "element-plus";

export default defineComponent({
    name: 'tag',
    components: {PriceTag},
    setup() {
        const plus = markRaw(Plus);
        return {plus}
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

    .tag-add {
        position: absolute;
        right: 40px;
        bottom: 40px;
    }
}
</style>