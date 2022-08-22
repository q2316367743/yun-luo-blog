<template>
    <container-header>
        <el-page-header title="关于" content="开源许可证" @back="goBack" style="margin-top: 8px;"/>
    </container-header>
    <container-main>
        <el-scrollbar>
            <el-card shadow="hover" class="license" v-for="openSource in openSourceList" :key="openSource.name">
                <div class="main">
                    <div class="name">
                        <span>{{ openSource.name }}</span>
                        <el-tag type="primary">{{ openSource.version }}</el-tag>
                    </div>
                    <div class="option">
                        <el-button type="primary" link @click="openUrl(openSource.homepage)">主页</el-button>
                        <el-button type="primary" link @click="openSource.showLicense = !openSource.showLicense">
                            许可证
                        </el-button>
                    </div>
                </div>
                <transition name="license" mode="out-in">
                    <div class="license" v-if="openSource.showLicense">
                        <el-divider></el-divider>
                        <apache2_0 v-if="openSource.license === 1"></apache2_0>
                        <mit v-else-if="openSource.license === 2"></mit>
                        <bsd v-else-if="openSource.license === 3"></bsd>
                    </div>
                </transition>
            </el-card>
        </el-scrollbar>
    </container-main>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Apache2_0 from "@/components/License/Apache2.0.vue";
import Mit from "@/components/License/Mit.vue";
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";
import Bsd from "@/components/License/bsd.vue";
import NativeApi from "@/api/NativeApi";

interface OpenSource {

    /**
     * 开源项目名称
     */
    name: string;

    /**
     * 版本
     */
    version: string;

    /**
     * 主页、项目地址
     */
    homepage: string;

    /**
     * 开源许可证
     */
    license: number;

    /**
     * 是否展示许可证
     */
    showLicense: boolean;

}

export default defineComponent({
    name: 'tool-about-open-source',
    components: {Bsd, ContainerMain, ContainerHeader, Mit, Apache2_0},
    data: () => ({
        openSourceList: [{
            name: 'vueuse',
            version: '^8.9.3',
            homepage: 'https://github.com/vueuse/vueuse',
            license: 2,
            showLicense: false
        }, {
            name: 'axios',
            version: '^0.27.2',
            homepage: 'https://github.com/axios/axios',
            license: 2,
            showLicense: false
        }, {
            name: 'compressing',
            version: '^1.6.2',
            homepage: 'https://github.com/node-modules/compressing',
            license: 2,
            showLicense: false
        }, {
            name: 'element-plus',
            version: '^2.2.9',
            homepage: 'https://github.com/element-plus/element-plus',
            license: 2,
            showLicense: false
        }, {
            name: 'fs-extra',
            version: '^10.1.0',
            homepage: 'https://github.com/jprichardson/node-fs-extra',
            license: 2,
            showLicense: false
        }, {
            name: 'highlight.js',
            version: '^11.6.0',
            homepage: 'https://github.com/highlightjs/highlight.js',
            license: 3,
            showLicense: false
        }, {
            name: 'js-yaml',
            version: '^4.1.0',
            homepage: 'https://github.com/nodeca/js-yaml',
            license: 2,
            showLicense: false
        }, {
            name: 'less',
            version: '^4.1.3',
            homepage: 'https://github.com/less/less.js',
            license: 1,
            showLicense: false
        }, {
            name: 'markdown-it',
            version: '^13.0.1',
            homepage: 'https://github.com/markdown-it/markdown-it',
            license: 2,
            showLicense: false
        }, {
            name: 'mitt',
            version: '^3.0.0',
            homepage: 'https://github.com/developit/mitt',
            license: 2,
            showLicense: false
        }, {
            name: 'monaco-editor',
            version: '^0.33.0',
            homepage: 'https://github.com/microsoft/monaco-editor',
            license: 2,
            showLicense: false
        }, {
            name: 'pinia',
            version: '^2.0.16',
            homepage: 'https://github.com/vuejs/pinia',
            license: 2,
            showLicense: false
        }, {
            name: 'qiniu-js',
            version: '^3.4.1',
            homepage: 'https://github.com/qiniu/js-sdk',
            license: 0,
            showLicense: false
        }, {
            name: 'ssh2-sftp-client',
            version: '^9.0.3',
            homepage: 'https://github.com/theophilusx/ssh2-sftp-client',
            license: 1,
            showLicense: false
        }, {
            name: 'vue',
            version: '^3.2.37',
            homepage: 'https://github.com/vuejs/vue',
            license: 2,
            showLicense: false
        }, {
            name: 'vue-i18n',
            version: '^9.2.0',
            homepage: 'https://github.com/intlify/vue-i18n-next',
            license: 2,
            showLicense: false
        }, {
            name: 'vue-router',
            version: '4',
            homepage: 'https://github.com/vuejs/vue-router',
            license: 2,
            showLicense: false
        }] as Array<OpenSource>
    }),
    methods: {
        goBack() {
            this.$router.push('/tool/about/self');
        },
        openUrl: NativeApi.openUrl,
    }
});
</script>
<style scoped lang="less">

.license {
    margin: 8px;

    .main {
        display: flex;
        justify-content: space-between;

        .name {
        }

        .option {
            padding-right: 16px;
        }
    }

    .license {

    }
}

.license-enter-active, .license-leave-active {
    transition: all .15s;
}

.license-enter, .license-leave-to {
    opacity: 0;
}

.license-enter-to, .license-leave {
    opacity: 1;
}
</style>