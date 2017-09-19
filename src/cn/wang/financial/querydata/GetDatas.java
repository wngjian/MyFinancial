package cn.wang.financial.querydata;

import cn.wang.utils.JsonUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2017/9/13 0013.
 */
@RequestMapping("/datas")
@Controller
public class GetDatas {

    /**
     * retrun jizhangdan xin xi
     *
     * @param out
     */
    @RequestMapping("/getMessage")
    public void getDatas(Writer out) {
        message mess = new message<person>();
        mess.setCode(0);
        mess.setCount(6);
        mess.setMsg("Successful");
        List<person> list = new ArrayList<person>();
        list.add(new person(1, "wang1", 21, "2017-09-13 12:12:12"));
        list.add(new person(2, "wang2", 21, "2017-09-13 12:12:12"));
        list.add(new person(3, "wang3", 21, "2017-09-13 12:12:12"));
        list.add(new person(4, "wang4", 21, "2017-09-13 12:12:12"));
        list.add(new person(5, "wang5", 21, "2017-09-13 12:12:12"));
        mess.setList(list);
        String ss = JsonUtil.toJson(mess);
        try {
            out.write(ss);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/getMonthData")
    public void getMonthData(Writer out) {
        String ss = "[{name: 'Dev #1',data: [5, 10, 20, 22, 25, 28, 30, 40, 80, 90, 100, 100]}, {name: 'Dev #2',data: [15, 15, 18, 40, 30, 25, 60, 60, 80, 70, 100, 100]}, {name: 'Dev #3',data: [1, 3, 6, 0, 50, 25, 50, 60, 30, 100, 100, 100]}]";
        try {
            out.write(ss);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/getAllData")
    public void getAllData(Writer out) {
        String ss = "[{type: 'pie',name: 'Dev #1',data: [['Processing.js', 55],['Impact.js', 10],['Other', 20],['Ease.js', 22],['Box2D.js', 25],['WebGL', 28],['DOM', 30],['CSS', 40],['Canvas', 80],['Javascript', 90]]}]";
        try {
            out.write(ss);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}


    class person {
        private int id;
        private String name;
        private int age;
        private String createtime;

        public person(int id, String name, int age, String createtime) {
            this.id = id;
            this.name = name;
            this.age = age;
            this.createtime = createtime;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        public String getCreatetime() {
            return createtime;
        }

        public void setCreatetime(String createtime) {
            this.createtime = createtime;
        }
    }

    class message<T> {
        private int code = 0;
        private String msg = "获取成功";
        private List<T> list;
        private int count;

        public int getCode() {
            return code;
        }

        public void setCode(int code) {
            this.code = code;
        }

        public String getMsg() {
            return msg;
        }

        public void setMsg(String msg) {
            this.msg = msg;
        }

        public List<T> getList() {
            return list;
        }

        public void setList(List<T> list) {
            this.list = list;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }
    }
