<template>
    <div class="post">
        <div class="board" @click="itemClick">
            <div class="title">
                <span>{{ post?.title }}</span>
                <el-tag v-if="post?.permalink && post?.permalink !== ''" style="margin-left: 16px">{{ post?.permalink }}</el-tag>
            </div>
            <div class="description">
                <div class="status" v-if="post?.status === 1">
                    <span class="badge draft"></span>
                    <span>{{ $t('post.list.draft') }}</span>
                </div>
                <div class="status" v-else-if="post?.status === 2">
                    <span class="badge release"></span>
                    <span>{{ $t('post.list.release') }}</span>
                </div>
                <div class="status" v-else-if="post?.status === 3">
                    <span class="badge recycle"></span>
                    <span>{{ $t('post.list.recycle') }}</span>
                </div>
                <div class="update-time">
                    <el-icon>
                        <Calendar/>
                    </el-icon>
                    <span>{{ format(post?.updated) }}</span>
                </div>
                <div class="tag" v-if="post?.tags && post?.tags.length > 0">
                    <el-icon>
                        <price-tag/>
                    </el-icon>
                    <span v-for="tag in post?.tags" class="tag-item">{{ tag }}</span>
                </div>
                <div class="category" v-if="post?.categories && post?.categories.length > 0">
                    <el-icon>
                        <collection-tag/>
                    </el-icon>
                    <span v-for="category in post?.categories" class="category-item">{{
                            category
                        }}</span>
                </div>
            </div>
        </div>
        <div class="option">
            <el-button type="primary" link @click="optionInfo">{{ $t('common.setting') }}
            </el-button>
            <el-button type="danger" link @click="optionRemove">{{ $t('common.delete') }}</el-button>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import {Calendar, CollectionTag, PriceTag} from '@element-plus/icons-vue';
import PostView from "@/views/PostView";
import DateUtil from "@/utils/DateUtil";

export default defineComponent({
    name: 'post-list-item',
    components: {Calendar, PriceTag, CollectionTag},
    props: {
        post: Object as PropType<PostView>
    },
    emits: ['item-click', 'option-info', 'option-remove'],
    data: () => ({}),
    methods: {
        format: DateUtil.formatDateTime,
        itemClick() {
            this.$emit('item-click');
        },
        optionInfo() {
            this.$emit('option-info');
        },
        optionRemove() {
            this.$emit('option-remove');
        }
    }
});
</script>
<style scoped lang="less">
.post {
    border-radius: 5px;
    border: #f2f2f2 solid 1px;
    padding: 10px;
    display: flex;
    font-size: 14px;
    margin-top: 10px;
    position: relative;

    &:hover {
        background-color: #fafafa;
        cursor: pointer;

        .option {
            display: block;
        }
    }
    &:last-child {
        margin-bottom: 10px;
    }

    .board {
        width: 100%;

        .title {
            font-size: 1.5em;
            line-height: 28px;
        }

        .description {
            font-size: 1em;
            display: flex;
            margin-top: 15px;
            color: #999999;
            height: 20px;

            .el-icon {
                vertical-align: -2px;
            }

            .status {
                .badge {
                    display: inline-block;
                    height: 6px;
                    width: 6px;
                    border-radius: 3px;
                    margin: 0 4px 2px;
                }

                .draft {
                    background-color: #909399;
                }

                .release {
                    background-color: #67C23A;
                }

                .recycle {
                    background-color: #F56C6C;
                }
            }

            .update-time {
                margin-left: 10px;

                i {
                    margin: 0 4px;
                }
            }

            .tag {
                margin-left: 10px;

                i {
                    margin: 0 4px;
                }

                .tag-item {
                    padding: 0 6px;
                    border-right: #999999 solid 1px;

                    &:last-child {
                        border-right: #ffffff;
                    }
                }
            }

            .category {
                margin-left: 10px;

                i {
                    margin: 0 4px;
                }

                .category-item {
                    padding: 0 6px;
                    border-right: #999999 solid 1px;

                    &:last-child {
                        border-right: #ffffff;
                    }
                }
            }
        }
    }

    .option {
        position: absolute;
        right: 42px;
        top: 32px;
        display: none;
    }
}
</style>