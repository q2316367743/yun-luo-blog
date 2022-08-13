<template>
    <container-header>
        <el-page-header title="工具" content="备份" @back="goBack" style="margin-top: 8px;"/>
    </container-header>
    <container-main style="padding: 16px">
        备份
    </container-main>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";

export default defineComponent({
    name: 'tool-backup',
    components: {ContainerMain, ContainerHeader},
    data: () => ({

    }),
    methods: {
        goBack() {
            this.$router.push('/tool');
        },
    }
});
</script>
<style scoped>

</style>