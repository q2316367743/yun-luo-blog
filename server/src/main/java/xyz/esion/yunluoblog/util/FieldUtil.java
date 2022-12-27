package xyz.esion.yunluoblog.util;

import cn.hutool.core.util.ReflectUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

/**
 * @author Esion
 * @since 2022/10/20
 */
public class FieldUtil {

    public static <T> QueryWrapper<T> buildQueryWrapper(Class<T> type) {
        QueryWrapper<T> queryWrapper = new QueryWrapper<>();
        if (ReflectUtil.hasField(type, "isEnable")) {
            queryWrapper.eq("is_enable", 1);
        }
        if (ReflectUtil.hasField(type, "usDelete")) {
            queryWrapper.eq("is_delete", 1);
        }
        queryWrapper.orderByDesc("create_time");
        return queryWrapper;
    }

}
