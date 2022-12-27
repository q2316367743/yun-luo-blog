package xyz.esion.yunluoblog.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import xyz.esion.yunluoblog.entity.Tag;
import xyz.esion.yunluoblog.service.TagService;
import xyz.esion.yunluoblog.mapper.TagMapper;
import org.springframework.stereotype.Service;

/**
* @author Esion
* @description 针对表【tag】的数据库操作Service实现
* @createDate 2022-12-27 21:47:39
*/
@Service
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag>
    implements TagService{

}




