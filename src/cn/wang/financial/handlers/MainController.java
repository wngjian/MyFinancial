package cn.wang.financial.handlers;

import cn.wang.financial.entities.Accounts;
import cn.wang.financial.entities.JiZhangDan;
import cn.wang.financial.entities.KeMu;
import cn.wang.financial.service.AccountsService;
import cn.wang.financial.service.JiZhangDanService;
import cn.wang.financial.service.KeMuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Date;
import java.util.List;


/**
 * Created by XRog
 * On 2/1/2017.12:36 AM
 */
@Controller
public class MainController {

    @Autowired
    private JiZhangDanService testService;
    @Autowired
    private KeMuService keMuService;
    @Autowired
    private AccountsService accountsService;

    @RequestMapping(value = "test", method = RequestMethod.GET)
    public String test(){
        System.out.println("////////////////////////////////////////////");


        JiZhangDan jj = new JiZhangDan();
        jj.setName("wwwwwwwwwww");
        jj.setCreatetime(new Date());
        jj.setMakeuser("wangjianquan");
        KeMu kk = new KeMu();
        kk.setName("kemu111");
        kk.setBianma("101010101010");
        kk.setCategory("xxxx");
        Accounts aa = new Accounts();
        aa.setAbs("11111111");
        aa.setKemu(kk);
        Accounts bb = new Accounts();
        bb.setKemu(kk);
        bb.setAbs("222222");

        aa.setJiZhangDan(jj);
        bb.setJiZhangDan(jj);



        keMuService.save(kk);

        testService.save(jj);

        accountsService.save(aa);
        accountsService.save(bb);





//        实际返回的是views/test.jsp ,spring-mvc.xml中配置过前后缀
        return "login.html";
    }

    @RequestMapping(value = "springtest", method = RequestMethod.GET)
    public String springTest(){

        System.out.println("////////////////////////////////////////////");
        List<Accounts> all = accountsService.findAll();
        System.out.println(all);

        return "login.html";
    }
}