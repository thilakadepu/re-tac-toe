package com.game.re_tac_toe.service;

import com.game.re_tac_toe.dto.UserDto;
import com.game.re_tac_toe.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.UUID;

public interface UserService extends UserDetailsService {
    User saveGuest(UserDto userDto);

    UserDetails loadUserById(UUID id);
}
