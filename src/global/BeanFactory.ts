import Database from "@/plugins/Database";

import TagService from '@/service/TagService';
import PostService from '@/service/PostService';
import CategoryService from "@/service/CategoryService";
import ServerService from "@/service/ServerService";
import SettingService from "@/service/SettingService";
import TerminalService from "@/service/TerminalService";

import Tag from "@/entities/Tag";
import Category from "@/entities/Category";
import Post from "@/entities/Post";
import PostTag from "@/entities/PostTag";
import PostCategory from "@/entities/PostCategory";
import Environment from "@/entities/Environment";
import EnvironmentService from "@/service/EnvironmentService";
import HintService from "@/service/HintService";

// 数据库操作
export const tagDb = new Database<Tag>('');
export const categoryDb = new Database<Category>('');
export const postDb = new Database<Post>('');
export const postTagDb = new Database<PostTag>('');
export const postCategoryDb = new Database<PostCategory>('');
export const pageDb = new Database<Post>('');
export const pageTagDb = new Database<PostTag>('');
export const pageCategoryDb = new Database<PostCategory>('');
export const environmentDb = new Database<Environment>('');

export const tagService = new TagService(tagDb, postTagDb, pageTagDb);
export const categoryService = new CategoryService(categoryDb, postCategoryDb, pageCategoryDb);
export const postService = new PostService("posts", tagDb, categoryDb, postDb, postTagDb, postCategoryDb);
export const pageService = new PostService("pages", tagDb, categoryDb, pageDb, pageTagDb, pageCategoryDb);

export const terminalService = new TerminalService();
export const serverService = new ServerService();
export const hintService = new HintService();

export const settingService = new SettingService();

export const environmentService = new EnvironmentService(environmentDb);