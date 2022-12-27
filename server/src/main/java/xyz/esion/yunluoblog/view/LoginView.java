package xyz.esion.yunluoblog.view;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author Esion
 * @since 2022/10/20
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginView implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 是否登录
     */
    private Boolean login;

    /**
     * token
     */
    private String token;

}
