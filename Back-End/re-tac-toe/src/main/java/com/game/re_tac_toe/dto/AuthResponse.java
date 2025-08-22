package com.game.re_tac_toe.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private long expiresIn;
}
