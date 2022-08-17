<template>
    <div id="workspace">
        <div class="title">请选择工作空间</div>
        <div class="selector">
            <el-scrollbar>
                <el-card class="item" v-for="history of histories"
                     :class="historyActive === history ? 'active' : ''"
                     @click="this.historyActive !== history ? this.historyActive = history : this.historyActive = ''">
                    <div class="path">{{ history }}</div>
                    <div class="close" @click.stop="remove(history)">
                        <el-icon>
                            <close/>
                        </el-icon>
                    </div>
                </el-card>
            </el-scrollbar>
        </div>
        <div class="choose">
            <el-button type="success" @click="openDialog">选择文件夹</el-button>
            <el-button type="primary" @click="chooseWorkspace" :disabled="historyActive === ''">选择</el-button>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import LocalStorageUtil from "@/utils/LocalStorageUtil";
import Constant from "@/global/Constant";
import {Close} from "@element-plus/icons-vue";
import FileApi from "@/api/FileApi";
import DialogApi from "@/api/DialogApi";

export default defineComponent({
    name: 'workspace',
    components: {
        Close
    },
    data: () => ({
        historyActive: "",
        histories: new Array<string>(),
    }),
    created() {
        this.historyActive = LocalStorageUtil.getOrDefault(Constant.LOCALSTORAGE.WORKSPACE, "");
        this.histories = LocalStorageUtil.getOrDefault(Constant.LOCALSTORAGE.WORKSPACE_HISTORY, []);
        if (this.historyActive === '') {
            FileApi.defaultDir().then(path => {
                this.historyActive = path;
                if (this.histories.length === 0) {
                    this.histories.push(this.historyActive)
                }
            })
        }
    },
    methods: {
        async openDialog() {
            const selected = await DialogApi.open({
                title: '请选择git文件路径',
                multiple: true,
                defaultPath: 'C:\\Program Files',
                directory: true
            });
            if (typeof selected === 'object' && selected) {
                this.historyActive = (selected as string[])[0];
                this.histories.push(this.historyActive)
            }
        },
        chooseWorkspace() {
            // 0. 设置当前工作空间
            LocalStorageUtil.set(Constant.LOCALSTORAGE.WORKSPACE, this.historyActive);
            // 1. 加入历史中
            let workspaceHistory = LocalStorageUtil.getOrDefault(Constant.LOCALSTORAGE.WORKSPACE_HISTORY, new Array<string>());
            workspaceHistory.push(this.historyActive)
            LocalStorageUtil.set(Constant.LOCALSTORAGE.WORKSPACE_HISTORY, workspaceHistory);
            // 2. 重新跳转加载页面
            this.$router.push("/loading");
        },
        remove(path: string) {
            if (path === this.historyActive) {
                this.historyActive = '';
            }
            this.histories.splice(this.histories.indexOf(path), 1);
        }
    }
});
</script>
<style lang="less">
#workspace {
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