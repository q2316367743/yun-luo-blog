<template>
    <div id="site">
        <div class="title">站点管理</div>
        <div class="selector">
            <el-scrollbar>
                <el-card class="item" v-for="item of sites"
                         :class="item.id === id ? 'active' : ''"
                         @click="this.id !== item.id ? this.id = item.id : this.id = 0">
                    <div class="path">{{ item.key }}</div>
                    <div class="close" @click.stop="remove(item.id)">
                        <el-icon>
                            <close/>
                        </el-icon>
                    </div>
                </el-card>
            </el-scrollbar>
        </div>
        <div class="choose">
            <el-button type="success" @click="addSite">新增</el-button>
            <el-button type="primary" @click="chooseSite" :disabled="id === 0">选择</el-button>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {Close} from '@element-plus/icons-vue';
import Entry from "@/global/Entry";
import LocalStorageUtil from "@/utils/LocalStorageUtil";
import Constant from "@/global/Constant";
import {ElMessageBox} from "element-plus";
import ArrayUtil from "@/utils/ArrayUtil";

export default defineComponent({
    name: 'site',
    components: {Close},
    data: () => ({
        id: 0,
        sites: new Array<Entry>()
    }),
    created() {
        // 获取站点
        this.id = LocalStorageUtil.getOrDefault(Constant.LOCALSTORAGE.SITE, {
            id: 0,
            key: '',
            value: ''
        }).id;
        this.sites = LocalStorageUtil.getOrDefault(Constant.LOCALSTORAGE.SITE_HISTORY, []);
    },
    methods: {
        addSite() {
            ElMessageBox.prompt('请输入站点名称', '新增站点', {
                confirmButtonText: '新增',
                cancelButtonText: '取消'
            }).then(({value}) => {
                let id = new Date().getTime();
                this.sites.push({
                    id: id,
                    key: value,
                    value: id + ""
                });
                this.id = id;
            })
        },
        chooseSite() {
            // 保存站点
            let site = ArrayUtil.map(this.sites, 'id').get(this.id);
            if (!site) {
                throw new Error('站点错误')
            }
            LocalStorageUtil.set(Constant.LOCALSTORAGE.SITE, site);
            LocalStorageUtil.set(Constant.LOCALSTORAGE.SITE_HISTORY, this.sites);
            this.$router.push('/loading');
        },
        remove(id: number) {
            this.sites.splice(this.sites.findIndex(e => e.id === id), 1);
        }
    }
});
</script>
<style lang="less">

#site {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    background-color: #ffffff;

    .title {
        font-size: 3em;
        text-align: center;
        width: 100%;
        margin-top: 25vh;
    }

    .selector {
        width: 446px;
        height: 200px;
        margin: 2vh auto;
        padding: 16px;
        background-color: #f2f2f2;

        .item {

            user-select: none;
            cursor: pointer;
            margin-top: 16px;
            position: relative;

            &:first-child {
                margin-top: 0;
            }

            .path {
            }

            .close {
                position: absolute;
                right: 16px;
                top: 22px;
            }

            &.active {
                background-color: #6c6c6c;
            }
        }
    }

    .choose {
        text-align: center;
        width: 100%;
    }
}
</style>