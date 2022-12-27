package xyz.esion.yunluoblog.propertity;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Esion
 * @since 2022/10/20
 */
@Data
@ConfigurationProperties(prefix = "yun-luo-blog")
public class YunLuoBlogProperty {

    private String username;

    private String password;

}
