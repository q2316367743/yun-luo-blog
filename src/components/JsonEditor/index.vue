<template>
    <div ref="container" :style="style"></div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import * as monaco from "monaco-editor";

let instance = {} as monaco.editor.IStandaloneCodeEditor;

export default defineComponent({
    name: 'json-editor',
    props: {
        modelValue: String,
    },
    data: () => ({
        content: '',
        style: {
            width: '100%',
            height: 'calc(100%)',
        }
    }),
    watch: {
        modelValue(newValue) {
            if (newValue !== instance.getValue()) {
                instance.setValue(newValue);
                instance.trigger(instance.getValue(), 'editor.action.formatDocument', null);
                this.content = newValue;
            }
        },
    },
    mounted() {
        const container = this.$refs.container as HTMLElement;
        instance = monaco.editor.create(container, {
            value: this.modelValue,
            language: 'js',
            automaticLayout: true
        });
        instance.onDidChangeModelContent(() => {
            const value = instance.getValue();
            if (this.content !== value) {
                this.$emit('update:modelValue', value);
            }
            return true;
        });
    },
    methods: {
        format() {
            instance.getAction('editor.action.formatDocument').run();
        },
        getInstance(): monaco.editor.IStandaloneCodeEditor {
            return instance;
        }
    }
});
</script>
<style scoped>

</style>