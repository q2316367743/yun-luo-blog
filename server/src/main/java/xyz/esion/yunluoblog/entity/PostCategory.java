package xyz.esion.yunluoblog.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * @TableName post_category
 */
@TableName(value ="post_category")
@Data
public class PostCategory implements Serializable {

    @TableId(type = IdType.INPUT)
    private Integer id;

    private Integer isDelete;

    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

    private Integer postId;

    private Integer categoryId;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}