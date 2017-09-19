package cn.wang.financial.entities;

import javax.persistence.*;

/**
 * Created by Administrator on 2017/9/14 0014.
 */
@Entity
@Table(name = "TiaoMu")
public class Accounts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "JIZHANGDAN_ID")
    private JiZhangDan jiZhangDan;
    @Column
    private String abs;
    @OneToOne
    @JoinColumn(name = "KEMU_ID")
    private KeMu kemu;
    @Column
    private float jiefangmoney;
    @Column
    private float daifangmoney;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public JiZhangDan getJiZhangDan() {
        return jiZhangDan;
    }

    public void setJiZhangDan(JiZhangDan jiZhangDan) {
        this.jiZhangDan = jiZhangDan;
    }

    public String getAbs() {
        return abs;
    }

    public void setAbs(String abs) {
        this.abs = abs;
    }

    public KeMu getKemu() {
        return kemu;
    }

    public void setKemu(KeMu kemu) {
        this.kemu = kemu;
    }

    public float getJiefangmoney() {
        return jiefangmoney;
    }

    public void setJiefangmoney(float jiefangmoney) {
        this.jiefangmoney = jiefangmoney;
    }

    public float getDaifangmoney() {
        return daifangmoney;
    }

    public void setDaifangmoney(float daifangmoney) {
        this.daifangmoney = daifangmoney;
    }

    @Override
    public String toString() {
        return "Accounts{" +
                "id=" + id +
                ", jiZhangDan=" + jiZhangDan +
                ", abs='" + abs + '\'' +
                ", kemu=" + kemu +
                ", jiefangmoney=" + jiefangmoney +
                ", daifangmoney=" + daifangmoney +
                '}';
    }
}
