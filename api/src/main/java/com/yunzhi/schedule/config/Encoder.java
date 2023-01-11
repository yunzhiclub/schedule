package com.yunzhi.schedule.config;

import java.math.BigInteger;
import java.security.MessageDigest;

public class Encoder {
    public static final String KEY_MD5 = "MD5";
    public static final String KEY_SHA = "SHA";

    public static  String  getMD5Result(String inputStr)
    {
        BigInteger bigInteger=null;

        try {
            MessageDigest md = MessageDigest.getInstance(KEY_MD5);
            byte[] inputData = inputStr.getBytes();
            md.update(inputData);
            bigInteger = new BigInteger(md.digest());
        } catch (Exception e) {e.printStackTrace();}
        return bigInteger.toString(16);
    }


    public static  String  getSHAResult(String inputStr)
    {
        BigInteger sha =null;
//        System.out.println("=======加密前的数据:"+inputStr);
        byte[] inputData = inputStr.getBytes();
        try {
            MessageDigest messageDigest = MessageDigest.getInstance(KEY_SHA);
            messageDigest.update(inputData);
            sha = new BigInteger(messageDigest.digest());
            System.out.println("SHA加密后:" + sha.toString(32));
        } catch (Exception e) {e.printStackTrace();}
        return sha.toString(32);
    }


}
