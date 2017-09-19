package cn.wang.financial.service.impl;

import cn.wang.financial.entities.Accounts;
import cn.wang.financial.repositiory.AccountsRepository;
import cn.wang.financial.service.AccountsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Administrator on 2017/9/15 0015.
 */
@Service
public class AccountsServiceImpl implements AccountsService {
    @Autowired
    private AccountsRepository accountsRepository;

    @Override
    public Accounts get(Integer id) {
        return accountsRepository.get(id);
    }

    @Override
    public List<Accounts> findAll() {
        return accountsRepository.findAll();
    }

    @Override
    public Integer save(Accounts entity) {
        return accountsRepository.save(entity);
    }

    @Override
    public void saveOrUpdate(Accounts entity) {
        accountsRepository.saveOrUpdate(entity);
    }

    @Override
    public void delete(Integer id) {
        accountsRepository.delete(id);
    }

    @Override
    public void flush() {
        accountsRepository.flush();
    }
}
