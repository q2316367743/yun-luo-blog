package xyz.esion.yunluoblog.view;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author Esion
 * @since 2022/10/19
 */
@Data
public class PageView<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 当前页面
     */
    private final Long pageNum;

    /**
     * 当前页面大小
     */
    private final Long pageSize;

    /**
     * 总页数
     */
    private final Long count;

    /**
     * 总数
     */
    private final Long total;

    /**
     * 记录
     */
    private final List<T> records;

    public static <T, S> PageView<T> transition(Page<S> page) {
        return new PageView<>(
                page.getCurrent(),
                page.getSize(),
                page.getPages(),
                page.getTotal(),
                new ArrayList<>()
        );
    }

    public static <T, S> PageView<T> transition(Page<S> page, Function<S, T> mapper) {
        return new PageView<>(
                page.getCurrent(),
                page.getSize(),
                page.getPages(),
                page.getTotal(),
                page.getRecords().stream().map(mapper).collect(Collectors.toList())
        );
    }

}
