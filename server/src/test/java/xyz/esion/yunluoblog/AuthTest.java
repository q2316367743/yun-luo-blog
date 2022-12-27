package xyz.esion.yunluoblog;

import cn.hutool.crypto.digest.DigestAlgorithm;
import cn.hutool.crypto.digest.Digester;

/**
 * @author Esion
 * @since 2022/10/20
 */
public class AuthTest {

    public static void main(String[] args) {
        Digester md5 = new Digester(DigestAlgorithm.MD5);
        System.out.printf(md5.digestHex("123456"));
    }

}
