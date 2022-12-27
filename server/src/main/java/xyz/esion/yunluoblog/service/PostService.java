package xyz.esion.yunluoblog.service;

import xyz.esion.yunluoblog.param.PageParam;
import xyz.esion.yunluoblog.param.PostParam;
import xyz.esion.yunluoblog.view.PageView;
import xyz.esion.yunluoblog.view.PostListView;

/**
 * @author Esion
 * @description 针对表【post】的数据库操作Service
 * @createDate 2022-12-27 21:47:39
 */
public interface PostService {

    PageView<PostListView> page(PageParam pageParam, PostParam param);

}
