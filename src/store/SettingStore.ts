import {defineStore} from "pinia";
import {useLocalStorage} from '@vueuse/core';

let syncSetting = useLocalStorage('syncSetting', {
    platform: "1",
    agreement: 'https://',
    url: '',
    git: {
        name: '',
        branches: '',
        username: '',
        email: '',
        token: '',
        cname: '',
    },
    coding: {
        tokenUsername: '',
    },
    proxy: {
        type: '1',
        path: '',
        port: 0
    },
    netlify: {
        siteId: '',
        accessToken: ''
    }
});

const imageSetting = useLocalStorage('imageSetting', {
    type: 1,
    qiNiu: {
        accessKey: '',
        secretKey: '',
        storageSpace: '',
        accessUrl: '',
        storageArea: '',
        urlSuffix: '',
        storagePath: ''
    },
    picGo: {
        address: '127.0.0.1',
        port: 36677
    }
});

const basicSetting = useLocalStorage('basicSetting', {
    blogType: 'hexo'
});


const environmentSetting = useLocalStorage('environmentSetting', {
    path: '',
    nodePath: '',
    npmPath: '',
    hexoPath: '',
    gitPath: ''
});

export const useSettingStore = defineStore('setting', {
    state: () => {
        return {
            basicSetting: basicSetting.value,
            syncSetting: syncSetting.value,
            imageSetting: imageSetting.value,
            environmentSetting: environmentSetting.value
        }
    },
    getters: {
        basic: (state) => {
            return state.basicSetting
        },
        sync: (state) => {
            return state.syncSetting;
        },
        image: (state) => {
            return state.imageSetting;
        },
        environment:(state) => {
            return state.environmentSetting;
        }
    },
    actions: {}
})