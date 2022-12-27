package xyz.esion.yunluoblog.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * @TableName category
 */
@TableName(value ="category")
@Data
public class Category implements Serializable {

    @TableId(type = IdType.INPUT)
    private Integer id;

    private Integer isDelete;

    private Integer isEnable;

    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

    private Integer parentId;

    private String name;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}