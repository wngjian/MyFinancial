package cn.wang.financial.filter;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Created by Administrator on 2017/9/11 0011.
 * login filter
 */
public class LoginFilter implements HandlerInterceptor {

    /**
     * Handler执行完成之后调用这个方法
     */
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response, Object handler, Exception exc)
            throws Exception {
    }

    /**
     * Handler执行之后，ModelAndView返回之前调用这个方法
     */
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView) throws Exception {
    }

    /**
     * Handler执行之前调用这个方法
     */
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {
        //获取请求的URL
        String url = request.getRequestURI();

        if (url != null){
            return true;
        }

        //URL:login是公开的;这个demo是除了login和静态资源文件是可以公开访问的，其它的URL都进行拦截控制

        if (url.contains("login") || url.contains("js") || url.contains("css") || url.contains("jpg") || url.contains("png") || url.contains("ico") || url.contains("woff")) {
            return true;
        }
        //获取Session
        HttpSession session = request.getSession();
        String username = (String) session.getAttribute("username");

        if (username != null) {
            return true;
        }
        //不符合条件的，跳转到登录界面
        request.getRequestDispatcher("/login.html").forward(request, response);

        return false;

    }

}