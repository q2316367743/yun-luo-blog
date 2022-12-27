package xyz.esion.yunluoblog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import xyz.esion.yunluoblog.propertity.YunLuoBlogProperty;

@SpringBootApplication
@EnableConfigurationProperties(YunLuoBlogProperty.class)
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

}
