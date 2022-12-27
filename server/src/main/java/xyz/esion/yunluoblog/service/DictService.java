package xyz.esion.yunluoblog.service;

import xyz.esion.yunluoblog.entity.Dict;
import com.baomidou.mybatisplus.extension.service.IService;
import xyz.esion.yunluoblog.enumeration.DictKeyEnum;

/**
* @author Esion
* @description 针对表【dict】的数据库操作Service
* @createDate 2022-10-19 22:50:39
*/
public interface DictService extends IService<Dict> {

    /**
     * 从字典中获取值
     *
     * @param keyEnum 键枚举
     * @param defaultValue 默认值
     * @return 返回值，找不到返回默认值
     */
    String get(DictKeyEnum keyEnum, String defaultValue);

    /**
     * 设置字典中的值
     *
     * @param keyEnum 键枚举
     * @param value 值
     */
    void set(DictKeyEnum keyEnum, String value);

}
