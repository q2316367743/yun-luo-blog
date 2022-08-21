<template>
    <div id="pretty-package">
        <json-editor v-model="content"></json-editor>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import JsonEditor from "@/components/JsonEditor/index.vue";
import Constant from "@/global/Constant";
import FileApi from "@/api/FileApi";

export default defineComponent({
    name: 'pretty-hexo-package-json',
    components: {JsonEditor},
    data: () => ({
        content: ''
    }),
    created() {
        Constant.FILE.HEXO.PACKAGE_JSON().then(packageJson => {
            FileApi.readFile(packageJson).then(content => {
                this.content = content;
            })
        })
    }
});
</script>
<style scoped>
#pretty-package{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>