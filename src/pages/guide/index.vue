<template>
    <!-- 引导页 -->
    <div id="guide">
        <div class="header">
            <el-steps :active="step">
                <el-step title="步骤 1" description="初始化文件夹" />
                <el-step title="步骤 2" description="初始化博客" />
                <el-step title="步骤 3" description="安装相关依赖" />
            </el-steps>
        </div>
        <div class="main">
            <div class="display">
                <el-scrollbar height="250px">
                    <p v-for="(item, index) of consoleList" :key="index">- [{{ formatDateTime(item.time) }}] - {{
                            item.remark
                    }}</p>
                </el-scrollbar>
            </div>
            <div class="option">
                <el-button @click="preStep" :disabled="!complete" v-if="step > 1">上一步</el-button>
                <el-button type="primary" @click="initFolder" v-if="step === 1">开始初始化</el-button>
                <el-button type="primary" @click="initBlog" v-if="step === 2">初始化博客</el-button>
                <el-button type="primary" @click="installDependencies" v-if="step === 3">安装相关依赖</el-button>
                <el-button @click="nextStep" :disabled="!complete" v-if="step < 3">下一步</el-button>
                <el-button @click="completeReload" :disabled="!complete" v-if="step === 3">完成</el-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useLocalStorage } from '@vueuse/core';
import { documentDir, resolve } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';

import DateUtil from '@/utils/DateUtil';
import FileUtil from "@/utils/FileUtil";
import Constant from '@/global/Constant';

interface Log {

    /**
     * 时间
     */
    time: Date;

    /**
     * 备注
     */
    remark: string;

}
let packageJson = `{
  "name": "hexo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "hexo": "^6.2.0"
  }
}`;

export default defineComponent({
    data: () => ({
        step: 1,
        complete: false,
        consoleList: new Array<Log>()
    }),
    setup() {
        const blogSetting = useLocalStorage('blogSetting', {
            type: 'hexo'
        });
        let type = blogSetting.value.type;
        return { type }
    },
    methods: {
        formatDateTime: DateUtil.formatDateTime,
        preStep() {
            if (this.step > 1) {
                this.step -= 1;
            }
        },
        nextStep() {
            if (this.step < 3) {
                this.step += 1;
            } else {
                this.step = 1;
            }
            this.complete = false;
        },
        initFolder() {
            // 创建目录
            this.consoleList.push({
                time: new Date(),
                remark: '开始创建文件夹【hexo】'
            });
            documentDir().then(path => {
                // 创建配置文件夹
                resolve(path, Constant.BASE, this.type).then(blogPath => {
                    FileUtil.createDir(blogPath).then(() => {
                        this.consoleList.push({
                            time: new Date(),
                            remark: '文件夹【hexo】创建成功'
                        });
                        this.step += 1;
                        this.complete = false;
                    }).catch((e) => {
                        console.error(e)
                        this.consoleList.push({
                            time: new Date(),
                            remark: '文件夹【hexo】创建失败，' + e
                        });
                    });
                });
            })
            this.complete = true;
        },
        initBlog() {
            this.consoleList.push({
                time: new Date(),
                remark: '开始初始化博客'
            });

            documentDir().then(path => {
                // 创建配置文件夹
                resolve(path, Constant.BASE, this.type).then(blogPath => {
                    // 新增文件
                    resolve(blogPath, Constant.PACKAGE_JSON).then(packagePath => {
                        FileUtil.writeFile(packagePath, packageJson);
                        invoke('npm_install', { currentDir: blogPath }).then(() => {
                            this.consoleList.push({
                                time: new Date(),
                                remark: '初始化npm - 成功'
                            });
                        }).catch((e) => {
                            this.consoleList.push({
                                time: new Date(),
                                remark: '初始化npm - 失败，' + e
                            });
                        })
                        this.complete = true;
                    })
                });
            })
        },
        installDependencies() {
            this.complete = true;
        },
        completeReload() {
            localStorage.setItem('isInit', '1');
            this.$nextTick(() => {
                location.reload();
            })
        }
    }
});
</script>
<style scoped lang="less">
#guide {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: #ffffff;

    .header {
        width: 700px;
        margin: 50px auto;
    }

    .main {
        width: 700px;
        margin: 50px auto;

        .display {
            height: 250px;
            background-color: #f2f2f2;
            border-radius: 5px;
            padding: 20px;

            p {
                margin: 4px;
            }
        }

        .option {
            margin-top: 30px;
            text-align: center;
        }
    }
}
</style>