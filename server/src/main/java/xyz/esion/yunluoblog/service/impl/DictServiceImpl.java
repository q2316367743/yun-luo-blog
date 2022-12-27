package xyz.esion.yunluoblog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import xyz.esion.yunluoblog.entity.Dict;
import xyz.esion.yunluoblog.enumeration.DictKeyEnum;
import xyz.esion.yunluoblog.service.DictService;
import xyz.esion.yunluoblog.mapper.DictMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author Esion
 * @description 针对表【dict】的数据库操作Service实现
 * @createDate 2022-10-19 22:50:39
 */
@Service
public class DictServiceImpl extends ServiceImpl<DictMapper, Dict>
        implements DictService {

    @Override
    public String get(DictKeyEnum keyEnum, String defaultValue) {
        Dict dict = this.getOne(new QueryWrapper<Dict>()
                .eq("dict_key", keyEnum.getKey()));
        return Optional.ofNullable(dict)
                .map(Dict::getDickValue)
                .orElse(defaultValue);
    }

    @Override
    public void set(DictKeyEnum keyEnum, String value) {
        Dict dict = new Dict();
        dict.setIsDelete(0);
        dict.setDictKey(keyEnum.getKey());
        dict.setDickValue(value);
        this.saveOrUpdate(dict);
    }
}




