import DexieInstance from '@/plugins/dexie';
import TagService from '@/service/TagService';
import PostService from '@/service/PostService';
import CategoryService from "@/service/CategoryService";
import HexoService from "@/service/HexoService";
import ServerService from "@/service/ServerService";

export const dexieInstance = new DexieInstance();
export const tagService = new TagService(dexieInstance);
export const postService = new PostService(dexieInstance);
export const categoryService = new CategoryService(dexieInstance);

export const hexoService = new HexoService();
export const serverService = new ServerService();
