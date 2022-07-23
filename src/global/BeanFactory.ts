import DexieInstance from '@/plugins/dexie';
import TagService from '@/service/TagService';
import PostService from '@/service/PostService';

export const dexieInstance = new DexieInstance();
export const tagService = new TagService(dexieInstance);
export const postService = new PostService(dexieInstance);
