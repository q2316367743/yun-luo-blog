<template>
    <div ref="container" :style="style"></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as monaco from 'monaco-editor';
import yaml from '@/plugins/language/yaml';
import markdown from '@/plugins/language/markdown';

let instance = {} as monaco.editor.IStandaloneCodeEditor;

export default defineComponent({
    name: 'monaco-editor',
    props: {
        modelValue: String,
        placeholder: {
            type: String,
            default: ''
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '200px'
        },
        language: {
            type: String,
            default: 'json',
            required: false
        }
    },
    data: () => ({
        content: '',
        style: {
            width: '100%',
            height: '100%',
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
    created() {
        // 创建时注册语言服务
        monaco.languages.register({id: 'yaml'});
        monaco.languages.setMonarchTokensProvider('yaml', yaml.token);
        monaco.languages.setLanguageConfiguration('yaml', yaml.config);
        monaco.languages.register({ id: 'markdown' });
        monaco.languages.setMonarchTokensProvider('markdown', markdown.token);
        monaco.languages.setLanguageConfiguration('markdown', markdown.config);
        // 语法提示
    },
    mounted() {
        const container = this.$refs.container as HTMLElement;
        this.style = {
            width: this.width,
            height: this.height
        }
        instance = monaco.editor.create(container, {
            value: this.modelValue,
            language: this.language,
            automaticLayout: true
        });
        instance.onDidChangeModelContent((e) => {
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
<style lang="less">
.es-monaco-editor {
    width: 100%;
    height: 100%;
}
</style>