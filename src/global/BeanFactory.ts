import Database from "@/plugins/Database";
import TagService from '@/service/TagService';
import PostService from '@/service/PostService';
import CategoryService from "@/service/CategoryService";
import HexoService from "@/service/HexoService";
import ServerService from "@/service/ServerService";
import SettingService from "@/service/SettingService";
import Tag from "@/entities/Tag";
import Category from "@/entities/Category";
import Post from "@/entities/Post";
import PostTag from "@/entities/PostTag";
import PostCategory from "@/entities/PostCategory";

// 数据库操作
export const tagDb = new Database<Tag>('');
export const categoryDb = new Database<Category>('');
export const postDb = new Database<Post>('');
export const postTagDb = new Database<PostTag>('');
export const postCategoryDb = new Database<PostCategory>('');

export const tagService = new TagService(tagDb, postTagDb);
export const postService = new PostService(tagDb, categoryDb, postDb, postTagDb, postCategoryDb);
export const categoryService = new CategoryService(categoryDb, postCategoryDb);

export const hexoService = new HexoService();
export const serverService = new ServerService();

export const settingService = new SettingService();