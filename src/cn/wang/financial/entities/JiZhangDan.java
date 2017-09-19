package cn.wang.financial.entities;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Administrator on 2017/9/5 0005.
 */

@Entity
@Table(name = "Zhangdan")
public class JiZhangDan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

//    @OneToMany
//    @Cascade(value = {CascadeType.SAVE_UPDATE})
//    @JoinColumn(name = "account_id")
//    private Set<Accounts> accounts = new HashSet<Accounts>();
    @Column
    private String name;
    @Column
    private Date createtime;
    @Column
    private Date committime;
    @Column
    private int otherCount;
    @Column
    private String zhizuoren;
    @Column
    private String shenpiren;
    @Column
    private String makeuser;
    @Column
    private String audituser;
    @Column
    private boolean isDel;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

//    public Set<Accounts> getAccounts() {
//        return accounts;
//    }
//
//    public void setAccounts(Set<Accounts> accounts) {
//        this.accounts = accounts;
//    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public Date getCommittime() {
        return committime;
    }

    public void setCommittime(Date committime) {
        this.committime = committime;
    }

    public int getOtherCount() {
        return otherCount;
    }

    public void setOtherCount(int otherCount) {
        this.otherCount = otherCount;
    }

    public String getZhizuoren() {
        return zhizuoren;
    }

    public void setZhizuoren(String zhizuoren) {
        this.zhizuoren = zhizuoren;
    }

    public String getShenpiren() {
        return shenpiren;
    }

    public void setShenpiren(String shenpiren) {
        this.shenpiren = shenpiren;
    }

    public String getMakeuser() {
        return makeuser;
    }

    public void setMakeuser(String makeuser) {
        this.makeuser = makeuser;
    }

    public String getAudituser() {
        return audituser;
    }

    public void setAudituser(String audituser) {
        this.audituser = audituser;
    }

    public boolean isDel() {
        return isDel;
    }

    public void setDel(boolean del) {
        isDel = del;
    }

    @Override
    public String toString() {
        return "JiZhangDan{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", createtime=" + createtime +
                ", committime=" + committime +
                ", otherCount=" + otherCount +
                ", zhizuoren='" + zhizuoren + '\'' +
                ", shenpiren='" + shenpiren + '\'' +
                ", makeuser='" + makeuser + '\'' +
                ", audituser='" + audituser + '\'' +
                ", isDel=" + isDel +
                '}';
    }
}
