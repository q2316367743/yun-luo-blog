<template>
    <div id="loading">
        <div class="loader">
            <div>l</div>
            <div>o</div>
            <div>a</div>
            <div>d</div>
            <div>i</div>
            <div>n</div>
            <div>g</div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";

export default defineComponent({
    name: 'loading',
    data: () => ({}),
    async created() {
        console.log('开始处理文件夹');
        await this.dirHandle();
        // 处理完成后跳转
        console.log('文件夹处理完成，跳转')
        this.$router.push('/post/list');
    },
    methods: {
        async dirHandle() {
            // 创建基础数据
            await this.createDir(await Constant.FOLDER.BASE());
            // 创建配置文件夹
            await this.createDir(await Constant.FOLDER.CONFIG());
            // 文章目录
            await this.createDir(await Constant.FOLDER.POST());
            // 图片目录
            await this.createDir(await Constant.FOLDER.POST_IMAGES());
            // 部署目录
            await this.createDir(await Constant.FOLDER.DIST());
            // git忽略文件
            let gitignore = await Constant.FILE.GITIGNORE();
            if (!await FileApi.exist(gitignore)) {
                // 不存在则创建
                await FileApi.writeFile(gitignore, Constant.CONTENT.GITIGNORE)
            }
            // Hexo目录
            await this.createDir(await Constant.FOLDER.HEXO());
        },
        async createDir(dir: string) {
            let exist = await FileApi.exist(dir);
            if (exist) {
                // 存在的话直接返回
                return Promise.resolve();
            } else {
                // 不存在则创建
                return FileApi.createDir(dir);
            }
        }
    }
});
</script>
<style lang="less">
#loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    background-color: #ffffff;
    font-weight: 100;
}


/* Start the loader code, first, let's align it the center of screen */
.loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    /* disable selection and cursor changes */
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: default;
    min-width: 33.25em;
}

.loader div {
    position: relative;
    width: 2.5em;
    height: 2.5em;
    background: #fff;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    border-radius: 100%;
    margin: 0 5px;
    float: left;
    font-size: 1.65em;
    line-height: 2.5em;
    animation: bounce 1.5s infinite ease-in-out;
}

.loader div:after {
    content: '';
    position: absolute;
    bottom: -2em;
    left: 0.35em;
    width: 1.8em;
    height: 0.5em;
    background: #322b27;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    border-radius: 100%;
}

.loader div:nth-child(1) {
    animation: bounceFirst 1.5s infinite ease-in-out;
    animation-delay: 0ms;
    background: #DB2F00;
    color: #fff;
}

.loader div:nth-child(2) {
    animation-delay: 0ms;
    background: #ff6d37;
    color: #fff;
}

.loader div:nth-child(3) {
    animation-delay: 50ms;
    background: #ffa489;
    color: #fff;
}

.loader div:nth-child(4) {
    animation-delay: 100ms;
    background: #f2f2f2;
    color: #555;
}

.loader div:nth-child(5) {
    animation-delay: 150ms;
    background: #99d3d4;
    color: #fff;
}

.loader div:nth-child(6) {
    animation-delay: 200ms;
    background: #56bebf;
    color: #fff;
}

.loader div:nth-child(7) {
    animation-delay: 250ms;
    color: #fff;
    background: #13A3A5;
}

@keyframes bounceFirst {
    0% {
        transform: translateX(0px);
    }
    20% {
        transform: translateX(-50px);
    }
    28% {
        transform: translateX(-50px);
    }
    50% {
        transform: translateX(100px);
    }
    80%, 100% {
        transform: translateX(0px);
    }
}



@keyframes bounce {
    0% {
        transform: translateX(0px);
    }
    20% {
        transform: translateX(0px);
    }
    28% {
        transform: translateX(0px);
    }
    50% {
        transform: translateX(100px);
    }
    80%, 100% {
        transform: translateX(0px);
    }
}

</style>