package cn.wang.financial.service.impl;

import cn.wang.financial.entities.User;
import cn.wang.financial.repositiory.UserRepository;
import cn.wang.financial.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Administrator on 2017/9/15 0015.
 */
@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;

    @Override
    public User get(Integer id) {
        return userRepository.get(id);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Integer save(User entity) {
        return userRepository.save(entity);
    }

    @Override
    public void saveOrUpdate(User entity) {
        userRepository.saveOrUpdate(entity);
    }

    @Override
    public void delete(Integer id) {
        userRepository.delete(id);
    }

    @Override
    public void flush() {
        userRepository.flush();
    }
}
