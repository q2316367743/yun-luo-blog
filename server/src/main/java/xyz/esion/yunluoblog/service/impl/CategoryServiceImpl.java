package xyz.esion.yunluoblog.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import xyz.esion.yunluoblog.entity.Category;
import xyz.esion.yunluoblog.service.CategoryService;
import xyz.esion.yunluoblog.mapper.CategoryMapper;
import org.springframework.stereotype.Service;

/**
* @author Esion
* @description 针对表【category】的数据库操作Service实现
* @createDate 2022-12-27 21:47:39
*/
@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category>
    implements CategoryService{

}




