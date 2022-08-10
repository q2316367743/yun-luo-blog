<template>
    <div id="terminal-hexo">
        <el-empty description="还没有任务..." v-if="terminalStacks.length === 0"></el-empty>
        <div v-else>
            <el-timeline>
                <el-timeline-item :timestamp="formatDateTime(terminalStack.time)" placement="top"
                                  v-for="terminalStack of terminalStacks"
                                  :key="terminalStack.id">
                    <el-card>
                        <template #header>
                            <div style="display: flex;justify-content: space-between;">
                                <div>
                                    <span>{{ terminalStack.name }}</span>
                                    <el-tag style="margin-left: 5px;" type="success" v-if="terminalStack.success">
                                        执行成功
                                    </el-tag>
                                    <el-tag style="margin-left: 5px;" type="danger" v-else>执行失败</el-tag>
                                    <el-tag style="margin-left: 5px;" v-if="terminalStack.run">运行中</el-tag>
                                    <el-tag style="margin-left: 5px;" type="danger"
                                            v-if="!terminalStack.run && terminalStack.success">已停止
                                    </el-tag>
                                </div>
                                <el-button class="button" text v-if="terminalStack.run" @click="kill(terminalStack.id)">
                                    停止
                                </el-button>
                            </div>
                        </template>
                        <el-divider content-position="center" @click="terminalStack.show = !terminalStack.show">
                            <span style="cursor:pointer;user-select: none;">展示/隐藏</span>
                        </el-divider>
                        <div v-if="terminalStack.show">
                            <el-scrollbar max-height="200px">
                                <div class="terminal-list">
                                    <p class="terminal-line" v-for="line in terminalStack.contents" v-html="line"></p>
                                </div>
                            </el-scrollbar>
                        </div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
    <div>
        <el-button-group>
            <el-button>初始化</el-button>
            <el-button @click="hexoService.server()">运行</el-button>
            <el-button @click="hexoService.deploy()">部署</el-button>
            <el-button>清理</el-button>
        </el-button-group>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {hexoService} from "@/global/BeanFactory";
import DateUtil from "@/utils/DateUtil";
import NativeApi from "@/api/NativeApi";
import {ElMessage} from "element-plus";
import TerminalStack from "@/entities/TerminalStack";

export default defineComponent({
    name: 'terminal-hexo',
    data: () => ({
        hexoService: hexoService
    }),
    methods: {
        formatDateTime: DateUtil.formatDateTime,
        kill(id: number) {
            NativeApi.kill(id).then(() => {
                ElMessage({
                    showClose: true,
                    type: "success",
                    message: "停止成功"
                });
            }).catch(e => {
                ElMessage({
                    showClose: true,
                    type: "error",
                    message: "停止失败，" + e
                });
            });
        }
    },
    computed: {
        terminalStacks(): Array<TerminalStack> {
            let terminalStackValues = this.hexoService.getTerminalStackMap().values();
            let terminalStacks = new Array<TerminalStack>();
            for (let item of terminalStackValues) {
                terminalStacks.push(item);
            }
            return terminalStacks.sort((e1, e2) => {
                return e2.time.getTime() - e1.time.getTime()
            });
        }
    }
});
</script>
<style scoped>
.terminal-list {
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    padding: 6px;
    background-color: #424251;
    margin-top: 10px;
    min-height: 30px;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: JetBrainsMono, serif;
}

.terminal-line {
    margin: 2px 0;
    padding: 0;
    box-sizing: border-box;
    outline: none !important;
    letter-spacing: 1px
}
</style>