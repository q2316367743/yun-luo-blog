package xyz.esion.yunluoblog.param;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.Data;

import java.io.Serializable;

/**
 * @author Esion
 * @since 2022/10/19
 */
@Data
public class PageParam implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 当前页面
     */
    private Long pageNum;

    /**
     * 当前页面大小
     */
    private Long pageSize;

    public <T> Page<T> toPage() {
        return new Page<>(this.getPageNum(), this.getPageSize());
    }

}
