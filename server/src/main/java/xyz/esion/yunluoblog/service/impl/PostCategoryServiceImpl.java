package xyz.esion.yunluoblog.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import xyz.esion.yunluoblog.entity.PostCategory;
import xyz.esion.yunluoblog.service.PostCategoryService;
import xyz.esion.yunluoblog.mapper.PostCategoryMapper;
import org.springframework.stereotype.Service;

/**
* @author Esion
* @description 针对表【post_category】的数据库操作Service实现
* @createDate 2022-12-27 21:47:39
*/
@Service
public class PostCategoryServiceImpl extends ServiceImpl<PostCategoryMapper, PostCategory>
    implements PostCategoryService{

}




