package xyz.esion.yunluoblog.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;

/**
 * @TableName post
 */
@TableName(value = "post")
@Data
public class Post implements Serializable {

    @TableId(type = IdType.INPUT)
    private Integer id;

    private Integer isDelete;

    private Integer isEnable;

    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;

    private String title;

    private String layout;

    private Integer status;

    private Integer comments;

    private String permalink;

    private String excerpt;

    @TableField("disable_nunjucks")
    private String disableNunjucks;

    private String lang;

    private String expand;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}