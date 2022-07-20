import { defineStore } from "pinia";
import { useLocalStorage } from '@vueuse/core';

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
    }
});

export const useSettingStore = defineStore('setting', {
    state: () => {
        return {
            // 全部的文章
            syncSetting: syncSetting.value,
            imageSetting: imageSetting.value
        }
    },
    getters: {
        sync: (state) => {
            return state.syncSetting;
        },
    },
    actions: {
    }
})