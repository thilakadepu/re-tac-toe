package com.game.re_tac_toe.service;

import com.game.re_tac_toe.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    void saveUser(UserDto userDto);

    boolean isUserPresent(String username);
}
