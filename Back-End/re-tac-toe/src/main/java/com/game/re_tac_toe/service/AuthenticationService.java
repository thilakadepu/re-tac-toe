package com.game.re_tac_toe.service;

import org.springframework.security.core.userdetails.UserDetails;

public interface AuthenticationService {
    String generateToken(UserDetails userDetails);
    UserDetails validateToken(String token);
}
