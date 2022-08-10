<template>
    <div id="terminal-hexo">
        <el-empty description="还没有任务..." v-if="hexoService.getTerminalStackMap().size === 0"></el-empty>
        <div v-else>
            <el-timeline>
                <el-timeline-item :timestamp="formatDateTime(terminalStack.time)" placement="top"
                                  v-for="terminalStack of hexoService.getTerminalStackMap().values()"
                                  :key="terminalStack.id">
                    <el-card>
                        <template #header>
                            <div style="display: flex;justify-content: space-between;">
                                <div>
                                    <span>{{ terminalStack.command }}</span>
                                    <el-tag style="margin-left: 5px;" type="success" v-if="terminalStack.success">执行成功</el-tag>
                                    <el-tag style="margin-left: 5px;" type="error" v-else>执行失败</el-tag>
                                    <el-tag style="margin-left: 5px;" v-if="terminalStack.run">运行中</el-tag>
                                </div>
                                <el-button class="button" text v-if="terminalStack.run">停止</el-button>
                            </div>
                        </template>
                        <div>
                            <el-button @click="terminalStack.show = !terminalStack.show">展示/隐藏</el-button>
                        </div>
                        <div v-if="terminalStack.show">
                            <p v-for="line in terminalStack.contents" v-html="line"></p>
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
            <el-button>部署</el-button>
            <el-button>清理</el-button>
        </el-button-group>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {hexoService} from "@/global/BeanFactory";
import DateUtil from "@/utils/DateUtil";

export default defineComponent({
    name: 'terminal-hexo',
    data: () => ({
        hexoService: hexoService
    }),
    methods: {
        formatDateTime: DateUtil.formatDateTime
    }
});
</script>
<style scoped>

</style>