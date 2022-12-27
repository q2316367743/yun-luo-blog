package xyz.esion.yunluoblog.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import xyz.esion.yunluoblog.entity.*;
import xyz.esion.yunluoblog.mapper.*;
import xyz.esion.yunluoblog.param.PageParam;
import xyz.esion.yunluoblog.param.PostParam;
import xyz.esion.yunluoblog.service.PostService;
import org.springframework.stereotype.Service;
import xyz.esion.yunluoblog.util.FieldUtil;
import xyz.esion.yunluoblog.view.PageView;
import xyz.esion.yunluoblog.view.PostListView;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @author Esion
 * @description 针对表【post】的数据库操作Service实现
 * @createDate 2022-12-27 21:47:39
 */
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostMapper postMapper;
    private final TagMapper tagMapper;
    private final CategoryMapper categoryMapper;
    private final PostTagMapper postTagMapper;
    private final PostCategoryMapper postCategoryMapper;

    @Override
    public PageView<PostListView> page(PageParam pageParam, PostParam param) {
        Page<Post> postPage = postMapper.selectPage(pageParam.toPage(), FieldUtil.buildQueryWrapper(Post.class));
        if (CollUtil.isEmpty(postPage.getRecords())) {
            return PageView.transition(postPage);
        }
        // 查询标签
        Map<Integer, List<PostTag>> postTagMap = postTagMapper.selectList(FieldUtil.buildQueryWrapper(PostTag.class)
                        .in("post_id", postPage.getRecords().stream()
                                .map(Post::getId)
                                .collect(Collectors.toList())))
                .stream().collect(Collectors.groupingBy(PostTag::getPostId));
        Map<Integer, Tag> tagMap = tagMapper.selectList(FieldUtil.buildQueryWrapper(Tag.class)
                        .in("id", postTagMap.values().stream()
                                .flatMap(Collection::stream)
                                .map(PostTag::getTagId)
                                .distinct()
                                .collect(Collectors.toList())))
                .stream().collect(Collectors.toMap(Tag::getId, e -> e));
        // 分类
        Map<Integer, List<PostCategory>> postCategoryMap = postCategoryMapper.selectList(FieldUtil.buildQueryWrapper(PostCategory.class)
                        .in("post_id", postPage.getRecords().stream()
                                .map(Post::getId)
                                .collect(Collectors.toList())))
                .stream().collect(Collectors.groupingBy(PostCategory::getPostId));
        Map<Integer, Category> categoryMap = categoryMapper.selectList(FieldUtil.buildQueryWrapper(Category.class)
                        .in("id", postCategoryMap.values().stream()
                                .flatMap(Collection::stream)
                                .map(PostCategory::getCategoryId)
                                .distinct()
                                .collect(Collectors.toList())))
                .stream().collect(Collectors.toMap(Category::getId, e -> e));
        return PageView.transition(postPage, e -> {
            PostListView view = BeanUtil.copyProperties(e, PostListView.class);
            view.setType("post");
            view.setTags(postTagMap.getOrDefault(e.getId(), new ArrayList<>())
                    .stream().map(PostTag::getTagId)
                    .map(tagMap::get)
                    .filter(Objects::nonNull)
                    .map(Tag::getName)
                    .collect(Collectors.toList()));
            view.setCategories(postCategoryMap.getOrDefault(e.getId(), new ArrayList<>())
                    .stream().map(PostCategory::getCategoryId)
                    .map(categoryMap::get)
                    .filter(Objects::nonNull)
                    .map(Category::getName)
                    .collect(Collectors.toList()));
            return view;
        });
    }
}




