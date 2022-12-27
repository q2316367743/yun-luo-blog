package xyz.esion.yunluoblog.view;

import lombok.Data;
import lombok.EqualsAndHashCode;
import xyz.esion.yunluoblog.entity.Post;

import java.io.Serializable;
import java.util.List;

/**
 * @author Esion
 * @since 2022/12/27
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class PostListView extends Post implements Serializable {

    private static final long serialVersionUID = 1L;

    private String type;

    private List<String> tags;

    private List<String> categories;

}
