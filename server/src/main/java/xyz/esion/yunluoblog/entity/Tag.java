package xyz.esion.yunluoblog.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * @TableName tag
 */
@TableName(value ="tag")
@Data
public class Tag implements Serializable {

    @TableId(type = IdType.INPUT)
    private Integer id;

    private Integer isDelete;

    private Integer isEnable;

    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

    private String name;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}