package cn.wang.financial.entities;

import javax.persistence.*;

/**
 * Created by Administrator on 2017/9/5 0005.
 */
@Entity
@Table(name = "KeMu")
public class KeMu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column
    private String bianma;
    @Column
    private String name;
    @Column
    private String category;
    @Column
    private String balancedirection;
    @Column
    private String quantity;
    @Column
    private String status;
    @Column
    private Boolean idDel;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBianma() {
        return bianma;
    }

    public void setBianma(String bianma) {
        this.bianma = bianma;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBalancedirection() {
        return balancedirection;
    }

    public void setBalancedirection(String balancedirection) {
        this.balancedirection = balancedirection;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIdDel() {
        return idDel;
    }

    public void setIdDel(Boolean idDel) {
        this.idDel = idDel;
    }
}
