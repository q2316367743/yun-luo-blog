<template>
    <container-header>
        <el-page-header title="关于" content="开源许可证" @back="goBack" style="margin-top: 8px;"/>
    </container-header>
    <container-main>
        <apache2_0></apache2_0>
    </container-main>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ContainerHeader from "@/components/Container/ContainerHeader.vue";
import ContainerMain from "@/components/Container/ContainerMain.vue";
import Apache2_0 from "@/components/License/Apache2.0.vue";

export default defineComponent({
    name: '',
    components: {Apache2_0, ContainerMain, ContainerHeader},
    data: () => ({

    }),
    methods: {
        goBack() {
            this.$router.push('/tool/about/self');
        },
    }
});
</script>
<style scoped>

</style>