package xyz.esion.yunluoblog.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import xyz.esion.yunluoblog.entity.PostTag;
import xyz.esion.yunluoblog.service.PostTagService;
import xyz.esion.yunluoblog.mapper.PostTagMapper;
import org.springframework.stereotype.Service;

/**
* @author Esion
* @description 针对表【post_tag】的数据库操作Service实现
* @createDate 2022-12-27 21:47:39
*/
@Service
public class PostTagServiceImpl extends ServiceImpl<PostTagMapper, PostTag>
    implements PostTagService{

}




