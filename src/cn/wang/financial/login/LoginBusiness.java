package cn.wang.financial.login;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.servlet.http.HttpSession;
import java.util.Map;

/**
 * Created by Administrator on 2017/9/5 0005.
 */
@SessionAttributes(value = {"username"})
@RequestMapping("/manage")
@Controller
public class LoginBusiness {

    @RequestMapping("/logins")
    public String loginControl(@RequestParam(value = "userName") String userName, @RequestParam(value = "password") String password, Map<String, Object> map) {
        System.out.println("user logins");
        System.out.println(userName + "  " + password);
        // @TODO logging check
        if ("www".equals(userName)){
            map.put("username", "www");
            return "redirect:/index.html";
        }
        return "redirect:/login.html";
    }

    @RequestMapping(value="/logout")
    public String logout(HttpSession session) throws Exception{
        //清除Session
        session.invalidate();

        return "redirect:/login.html";
    }

}
