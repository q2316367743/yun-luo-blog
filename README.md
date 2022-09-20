# 云落博客

️一个静态博客写作客户端 (A static blog writing client)

## 简介

一个静态博客写作客户端，可以搭配多种博客生成器（hexo、vuepress。。。），可视化配置

## 下载

- [GitHub Release](https://github.com/q2316367743/yun-luo-blog/releases)
- [Gitee Release](https://gitee.com/qiaoshengda/yun-luo-blog/releases)
- [百度云盘](https://pan.baidu.com/s/1URbwsRhLeJZDeRvspW0n9g?pwd=fx4v)（**推荐**）
- [阿里云盘](https://www.aliyundrive.com/s/xk3VL7tyNsv)

## 文档

- [GitHub Pages](https://q2316367743.github.io/yun-luo-blog)
- [国内访问](https://docs.esion.xyz/yun-luo-blog)

## 特性

- 📝 你可以使用最酷的**Markdown**语法，进行快速创作
- 🌉 你可以给文章配上精美的封面图和在文章任意位置插入图片
- 🏷️ 你可以对文章进行标签分组
- 💻 你可以在**𝖶𝗂𝗇𝖽𝗈𝗐𝗌**或~~𝖬𝖺𝖼𝖮𝖲~~或~~Linux~~设备上使用此客户端
- 🌎 你可以使用**𝖦𝗂𝗍𝗁𝗎𝖻 𝖯𝖺𝗀𝖾𝗌**或**Coding Pages**向世界展示，未来将支持更多平台
- 🇬🇧 你可以使用**中文简体**、**英语**
- 🌁 你可以任意使用`hexo`默认主题或任意第三方主题，强大的主题自定义能力
- 🖥 你可以自定义源文件夹，利用 git、百度网盘 等进行多设备同步

未来，它一定会成为你离不开的伙伴

尽情发挥你的才华吧！

😘 Enjoy~

## 亮点

1. 更好用的markdown编辑器，基于Monaco Editor编辑器，语法提示，本地图片提示
2. 分类管理，标签管理，可以更快速的选择标签
3. 可视化配置，免去查询配置文档的麻烦
4. 图片存储可选择`本地`、`七牛云`、`PicGo`
5. 一键执行相关命令：**打包**、**运行**、**编译**
6. 一键发布到`GitHub Pages`、`Gitee Pages`、`FTP`、`SFTP`

## 技术选型

- [Electron](https://github.com/electron/electron)
- [Element Plus](https://element-plus.gitee.io/zh-CN/)
- [Vue3](https://v3.cn.vuejs.org/)
- [Vite2](https://vitejs.cn/)
- [TypeScript](https://www.tslang.cn/)

##  站在巨人的肩膀上

- [Gridea](https://gitee.com/fehey/gridea)
- [vscode-hexo-utils](https://gitee.com/cwxyz007/vscode-hexo-utils)
- [Publii](https://github.com/GetPublii/Publii)

## 项目计划

- [ ] 全局管理
    - [x] 屏蔽右键
    - [x] monaco editor部署问题
    - [x] 将项目改为electron
    - [x] 可以设置项目目录
        1. 判断目标文件夹是否存在
        2. 判断目标文件夹是否为空（只给提示）
        3. 将当前文件夹复制到目标文件夹
        4. 询问是否删除源文件夹
    - [x] 所有的loading都必须有错误拦截
    - [ ] 国际化
    - [ ] 主题
    - [x] 自定义标题栏💔
- [x] 实现标签管理
    - [x] 删除标签
- [x] 实现分类管理
- [ ] 文章列表
    - [x] 删除 - 批量删除
    - [x] 设置基础信息
    - [x] 通过名称、状态、排序查询
- [ ] 文章编辑
    - [ ] 常用快捷键
    - [x] 文章设置
        - [x] 不使用抽屉，使用弹框
        - [x] 将属性进行分类
    - [x] 文章拓展属性
    - [x] 文章创建时间与更新时间存储格式修改
    - [x] 使用yaml解析、保存文章Front-matter
    - [x] Front-matter的额外属性
- [ ] 页面列表
    - [ ] 与文章列表一致
- [ ] 页面编辑
    - [ ] 与文章编辑一致
- [x] 博客配置
    - [x] hexo全局配置文件
    - [x] 主题配置文件（hexo根目录下创建文件_config.\[主题名\].yaml）
    - [x] 关键字采用tag
- [ ] 主题、插件配置
    - [x] 在一个页面展示
    - [x] 使用git命令下载主题
    - [x] 使用npm命令安装、卸载插件
    - [x] 修改主题名称需要同时修改配置文件名称
    - [x] 可以在主题页面直接修改主题配置
    - [x] 读取配置文件生成插件目录
- [ ] 项目设置
    - [ ] 可以在设置页面直接导入文章（markdown文件，zip压缩包）
    - [x] 设置npm镜像，默认是阿里镜像
    - [ ] 选择npm路径后可以自动安装hexo
- [ ] 图片使用图床
    - [ ] 本地图片
        - [x] 解决本地图片问题
        - [ ] 清除无用图片
    - [x] PicGo
    - [ ] 七牛云
- [ ] 实现本地命令
    - [x] 清理（`clean`）
    - [x] 构建（`deploy`）
- [ ] 服务器
    - [x] 实现可开启可关闭
    - [x] 开启状态时监听文件改变（保存文件）事件，进行重新打包
    - [x] 设置
        - [x] 端口
        - [x] 文件更新是否同步更新
        - [x] 服务器更新是否发送通知
        - [x] 服务器异常是否发送通知
- [ ] 小工具
    - [ ] 博客远程部署
        - [ ] ftp
        - [x] SFTP(勉强实现)
        - [ ] GIthub Pages
        - [ ] GItee Pages
    - [ ] 博客导入
        - [ ] markdown文件导入
        - [ ] 配置文件导入
        - [ ] 压缩包导入
    - [ ] 博客导出
        - [ ] 整体导出
        - [ ] markdown文件导出
- [ ] 项目同步❤️
    - [ ] git
    - [ ] sftp
    - [ ] ftp
    - [ ] webdev
- [ ] 实现其他静态网站生成
    - [ ] vuepress
    - [ ] vitepress
    - [ ] gitbook
- [ ] 高级选项
    - [x] 多项目/多站点切换
        - [x] 在一个文件夹中进行切换
    - [x] 数据存放本地❤️
    - [x] 增加加载页

## 开发相关配置

```bash
pnpm config set electron_mirror "https://npm.taobao.org/mirrors/electron/"

pnpm config set ELECTRON_BUILDER_BINARIES_MIRROR "https://npm.taobao.org/mirrors/electron-builder-binaries/"
```

## 相关参考

- [主题的实现](https://www.cnblogs.com/lyzz1314/p/15750722.html)
- [typo.css](https://typo.sofi.sh/)

## 支持的建站系统

- [ ] [Blogdown](https://github.com/rstudio/blogdown)
- [ ] [Docusaurus](https://docusaurus.io/)
- [ ] [Gatsby](https://gatsbyjs.org/)
- [ ] [Ghost](https://ghost.org/)
- [ ] [Gridea](https://gridea.dev/)
- [ ] [Halo](https://github.com/halo-dev/halo)
- [x] [Hexo](https://hexo.io/)
- [ ] [Hugo](https://gohugo.io/)
- [ ] [Jekyll](https://jekyllrb.com/)
- [ ] [Pelican](https://blog.getpelican.com/)
- [ ] [Saber](https://saber.land/)
- [ ] [Typecho](https://typecho.org/)
- [ ] [Vuepress](https://vuepress.vuejs.org/)
- [ ] [Wordpress](https://wordpress.com/)
- [ ] [Wowchemy](https://wowchemy.com/)
- [ ] [Hugo](https://gohugo.io/)
- [ ] [Typecho](https://typecho.org/)

## 支持的图床

- [x] 本地
- [ ] 七牛云
- [x] PicGo

## 版本

### 0.1.1

- [x] 修复图片插入路径错误
- [x] 可以主动点击服务器更新
- [x] 配置文件保存备注
- [x] 插件列表读取dev依赖
- [x] 配置文件修改，主题、插件修改都需要更新
- [x] 其他设置与已知设置分离
- [x] 部署时删除原文件夹下文章

### 0.1.2

- [x] 主题编辑器
- [x] 插件直接查看package.json文档
- [x] 主题与插件增加搜索
- [x] 关于页面优化
- [x] 增加开源项目说明
- [x] 工作空间切换

### 0.2.0

- [x] SFTP上传时应该删除远程文件
- [x] 开源许可证中版本需要和名称远一点
- [x] 复制草稿文章到草稿文件夹
- [x] 保存时如果标签未解析会报错
- [x] 标签增加页面计数
- [x] 增加【页面】

### 0.2.1

- [x] 删除主题失效
- [x] 主题下载转移到终端
- [x] 增加markdown-it插件
- [x] 美化 => 主题编辑器，发送更新消息
- [x] 新建页面与文章时，可以选择布局
- [x] 主题压缩包解压有问题
- [x] 主题文件管理：可以拖动、重命名、删除、新建文件、新建文件夹、删除
- [x] 主题文件管理：在资源管理器中打开
- [x] 将命令栈分离出来

### 0.2.2

- [x] 导出支持zip压缩包
- [x] 设置增加额外属性 - 文本编辑器
- [x] 可配置的【front-matter】
- [x] 改进hexo命令，使用`hexo generate`替代`hexo deploy`
- [x] 数据存储应该存储相对目录，而不是绝对目录【急切】
- [x] `ElMessage`都需要`showClose`

### 0.3.0

- [x] 文章列表 - 分类视图
- [x] 额外数据编辑
- [x] 环境设置可以设置多环境，进行切换。选择的环境保存到内存中

### 0.3.1

- [x] 紧急修复发布文章后立即保存文章会报错
- [x] 修改工作空间逻辑，去除工作空间强制在选定文件夹下创建`yun-luo-blog`的逻辑

> 注意，更新需要重新选择工作空间，默认工作空间在用户目录下的`yun-luo-blog`文件夹下，重新选择这个文件夹就好

### 0.3.2

- [x] 紧急修复v0.3.1工作空间的问题

### 0.3.3

* [X] 启动服务器时自动构建
* [X] 同步增加选项：仅构建、仅部署
* [X] 点击服务器显示服务器信息，而不是启动和关闭
* [X] 修复服务器访问，增加参数显示404的BUG
* [X] 优化设置页面
* [X] 改造设置页面

### 0.4.0

- [ ] 增加vuepress

### 1.0.0

* [ ] 主题/插件更新功能
* [ ] 本地同步【急切】
* [ ] 增加仪表盘
* [ ] 增强编辑器
* [ ] 文章编辑支持多编辑器
* [ ] 可以导出源文件，不仅仅导出zip，导出源文件需要增加不删除文件夹
* [ ] 完善编辑器

### 2.0.0

* [ ] 完善hexo

### 3.0.0

* [ ] 增加vuepress
