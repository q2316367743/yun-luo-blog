<template>
    <div id="file-manage">
        <div class="file-menu" @click="fileMenuClick" @contextmenu="fileContextClick">
            <el-scrollbar>
                <el-tree :data="files" :props="fileProps" empty-text="暂无文件" draggable :allow-drop="allowDrag"
                         @node-click="nodeClick" @node-contextmenu="nodeContextMenu" @node-drop="nodeDrag">
                    <template #default="{ node, data }">
                        <el-icon>
                            <folder-opened v-if="data.isDirectory && node.expanded"/>
                            <Folder v-if="data.isDirectory && !node.expanded"/>
                            <Document v-if="!data.isDirectory"/>
                        </el-icon>
                        <span>{{ node.label }}</span>
                    </template>
                </el-tree>
            </el-scrollbar>
        </div>
        <div class="file-editor">
            <theme-file-editor v-model="fileContent" v-model:language="language"
                               v-show="showInfo"></theme-file-editor>
            <el-empty description="请选择文件" v-if="!showInfo" style="margin-top: 15vh"></el-empty>
        </div>
        <div class="context-menu" v-show="contextMenu.show" :style="`left: ${contextMenu.x}px;top: ${contextMenu.y}px`">
            <div class="context-menu-item" @click="newFile" v-if="contextMenu.isRoot || contextMenu.isDirectory">
                新建文件
            </div>
            <div class="context-menu-item" @click="newFolder" v-if="contextMenu.isRoot || contextMenu.isDirectory">
                新建文件夹
            </div>
            <div class="context-menu-item" @click="mapFiles">刷新</div>
            <div class="context-menu-item" @click="openWithExplorer">打开于</div>
            <div class="context-menu-item" @click="rename" v-if="!contextMenu.isRoot">重命名</div>
            <div class="context-menu-item" @click="remove" v-if="!contextMenu.isRoot">删除</div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {Document, Folder, FolderOpened} from '@element-plus/icons-vue';
import FileEntry from "@/api/entities/FileEntry";
import FileApi from "@/api/FileApi";
import ThemeFileEditor from "@/components/ThemeFileEditor/index.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import ArrayUtil from "@/utils/ArrayUtil";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import Node from "element-plus/es/components/tree/src/model/node";
import NativeApi from "@/api/NativeApi";

export default defineComponent({
    name: 'pretty-hexo-file-manage',
    components: {ThemeFileEditor, Document, Folder, FolderOpened},
    data: () => ({
        files: new Array<FileEntry>(),
        fileProps: {
            children: 'children',
            label: 'name',
        },
        // 当前主题
        file: {} as FileEntry | undefined,
        fileContent: '',
        showInfo: false,
        language: '',
        baseFolder: '',
        contextMenu: {
            x: 0,
            y: 0,
            show: false,
            isDirectory: false,
            isRoot: false,
            name: '',
            path: ''
        }
    }),
    async created() {
        console.log('创建文件管理器')
        // 获取当前主题目录
        this.baseFolder = this.$route.query.baseFolder as string;
        // 获取主题目录下文件
        await this.mapFiles();
        // 增加快捷键
        document.onkeydown = (e) => {
            // 各种快捷键
            if (e.ctrlKey) {
                if (e.code == 'KeyS') {
                    this.save();
                }
            }
        }
    },
    unmounted() {
        // 取消快捷键
        document.onkeydown = null;
    },
    methods: {
        async mapFiles() {
            this.contextMenu.show = false;
            // 目录下全部文件
            this.files = await FileApi.listDir(this.baseFolder, true);
        },
        nodeClick(data: FileEntry) {
            this.contextMenu.show = false;
            if (!data.isDirectory) {
                this.file = data;
                this.language = data.path.substring(data.path.lastIndexOf('.') + 1);
                if (ArrayUtil.contains(['jpg', 'jpeg', 'png', 'gif', 'webp'], this.language)) {
                    ElMessage({
                        showClose: true,
                        type: 'warning',
                        message: '不能打开图片'
                    });
                    this.fileContent = '';
                    return;
                }
                FileApi.readFile(data.path).then(content => {
                    // 读取这里文件内容
                    this.fileContent = content;
                    this.showInfo = true;
                })
            } else {
                this.showInfo = false;
            }
        },
        save() {
            // 保存
            if (this.file && this.file.path && this.file.path !== '') {
                FileApi.writeFile(this.file.path, this.fileContent).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: this.$t('hint.save_success')
                    });
                    emitter.emit(MessageEventEnum.CONFIG_UPDATE);
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: this.$t('hint.save_fail') + ',' + e
                    });
                })
            } else {
                ElMessage({
                    showClose: true,
                    type: 'warning',
                    message: '未选择文件'
                });
            }
        },
        fileMenuClick() {
            this.file = undefined;
            this.fileContent = ''
            this.contextMenu.show = false;
            this.showInfo = false;
        },
        fileContextClick(event: MouseEvent) {
            this.contextMenu = {
                x: event.offsetX,
                y: event.offsetY,
                show: true,
                isDirectory: false,
                isRoot: true,
                name: '',
                path: this.baseFolder
            }
        },
        newFile() {
            this.contextMenu.show = false;
            this.showInfo = false;
            ElMessageBox.prompt('请输入新文件名称', '新建文件', {
                type: 'info',
                confirmButtonText: this.$t('common.new'),
                cancelButtonText: this.$t('common.cancel'),
                inputPattern: /.+/
            }).then(({value}) => {
                FileApi.resolve(this.contextMenu.path, value).then((path => {
                    FileApi.writeFile(path, "").then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: this.$t('hint.new_success')
                        });
                        this.mapFiles();
                        emitter.emit(MessageEventEnum.CONFIG_UPDATE);
                    }).catch(e => {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: this.$t('hint.new_fail') + ',' + e
                        });
                    })
                }))
            }).catch(() => {
                console.error('取消新建文件')
            });
        },
        newFolder() {
            this.contextMenu.show = false;
            this.showInfo = false;
            ElMessageBox.prompt('请输入新文件夹名称', '新建文件', {
                type: 'info',
                confirmButtonText: this.$t('common.new'),
                cancelButtonText: this.$t('common.cancel'),
                inputPattern: /.+/
            }).then(({value}) => {
                FileApi.resolve(this.contextMenu.path, value).then((path => {
                    FileApi.createDir(path).then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: this.$t('hint.new_success')
                        });
                        this.mapFiles();
                        emitter.emit(MessageEventEnum.CONFIG_UPDATE);
                    }).catch(e => {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: this.$t('hint.new_fail') + ',' + e
                        });
                    })
                }))
            }).catch(() => {
                console.error('取消新建文件夹')
            });
        },
        rename() {
            this.contextMenu.show = false;
            this.showInfo = false;
            let parentPath = this.contextMenu.path.substring(0, this.contextMenu.path.indexOf(this.contextMenu.name));
            ElMessageBox.prompt(`请输入新文件${this.contextMenu.isDirectory ? '夹' : ''}名称`, '新建文件', {
                type: 'info',
                confirmButtonText: this.$t('common.new'),
                cancelButtonText: this.$t('common.cancel'),
                inputValue: this.contextMenu.name,
                inputPattern: /[A-Za-z0-9\u4e00-\u9fa5]+/
            }).then(({value}) => {
                FileApi.rename(parentPath + this.contextMenu.name, parentPath + value).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: this.$t('hint.new_success')
                    });
                    this.mapFiles();
                    emitter.emit(MessageEventEnum.CONFIG_UPDATE);
                }).catch(e => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: this.$t('hint.new_fail') + ',' + e
                    });
                });
            }).catch(() => {
                console.error('取消重命名文件')
            });
        },
        remove() {
            this.contextMenu.show = false;
            this.showInfo = false;
            ElMessageBox.confirm(
                `是否要删除文件${this.contextMenu.isDirectory ? '夹' : ''}【${this.contextMenu.name}】，删除后将无法恢复`,
                `删除文件${this.contextMenu.isDirectory ? '夹' : ''}`,
                {
                    type: 'warning',
                    confirmButtonText: '删除',
                    cancelButtonText: '取消'
                }
            ).then(() => {
                // 删除
                if (this.contextMenu.isDirectory) {
                    FileApi.listDir(this.contextMenu.path, false).then(files => {
                        if (files.length > 0) {
                            ElMessageBox.confirm(
                                '此文件夹中存在其他文件及文件夹，是否强制删除',
                                '警告',
                                {
                                    type: 'warning',
                                    confirmButtonText: '删除',
                                    cancelButtonText: '取消'
                                }
                            ).then(() => {
                                FileApi.removeDir(this.contextMenu.path, true).then(() => {
                                    ElMessage({
                                        showClose: true,
                                        type: 'success',
                                        message: this.$t('hint.delete_success')
                                    });
                                    this.mapFiles();
                                    emitter.emit(MessageEventEnum.CONFIG_UPDATE);
                                }).catch(e => {
                                    ElMessage({
                                        showClose: true,
                                        type: 'error',
                                        message: this.$t('hint.delete_fail') + ',' + e
                                    });
                                });
                            })
                        } else {
                            FileApi.removeDir(this.contextMenu.path, true).then(() => {
                                ElMessage({
                                    showClose: true,
                                    type: 'success',
                                    message: this.$t('hint.delete_success')
                                });
                                this.mapFiles();
                                emitter.emit(MessageEventEnum.CONFIG_UPDATE);
                            }).catch(e => {
                                ElMessage({
                                    showClose: true,
                                    type: 'error',
                                    message: this.$t('hint.delete_fail') + ',' + e
                                });
                            });
                        }
                    }).catch(e => {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: this.$t('hint.delete_fail') + ',' + e
                        });
                    });
                } else {
                    FileApi.removeFile(this.contextMenu.path).then(() => {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: this.$t('hint.delete_success')
                        });
                        this.mapFiles();
                        emitter.emit(MessageEventEnum.CONFIG_UPDATE);
                    }).catch(e => {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: this.$t('hint.delete_fail') + ',' + e
                        });
                    });
                }
            })
        },
        nodeContextMenu(event: PointerEvent, data: FileEntry) {
            this.contextMenu = {
                x: event.clientX - 216,
                y: event.clientY - 86,
                show: true,
                isDirectory: data.isDirectory!,
                isRoot: false,
                name: data.name!,
                path: data.path
            }
            this.showInfo = false;
        },
        allowDrag(_draggingNode: Node, dropNode: Node) {
            return dropNode.data.isDirectory;
        },
        nodeDrag(startNode: Node, endNode: Node, type: string) {
            let startPath = startNode.data.path;
            let startName = startNode.data.name;
            let endPath = endNode.data.path as string;
            if (type !== 'inner') {
                // 如果不是移入，则需要处理目标路径
                let endName = endNode.data.name;
                endPath = endPath.substring(0, endPath.indexOf(endName));
            }
            FileApi.resolve(endPath, startName).then(targetPath => {
                FileApi.mv(startPath, targetPath).then(() => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: '移动成功'
                    });
                    this.showInfo = false;
                    this.mapFiles();
                }).catch((e) => {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '移动失败' + '1,' + e
                    });
                });
            }).catch((e) => {
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '移动失败' + '2,' + e
                });
            });
        },
        openWithExplorer() {
            this.contextMenu.show = false;
            NativeApi.openFolder(this.contextMenu.path);
        }
    }
});
</script>
<style lang="less">
#file-manage {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .file-menu {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 200px;
        border-right: #eeeeee solid 1px;
    }

    .file-editor {
        position: absolute;
        top: 0;
        left: 200px;
        right: 0;
        bottom: 0;
    }

    .context-menu {
        position: absolute;
        width: 100px;
        background: #f2f2f2;
        padding: 4px 4px;
        box-shadow: 1px 1px #f2f2f2;
        border-radius: 4px;

        .context-menu-item {
            margin-top: 4px;
            cursor: pointer;
            padding: 0 4px;

            &:hover {
                background-color: #ffffff;
            }

            &:nth-child(1) {
                margin-top: 0;
            }
        }
    }
}
</style>