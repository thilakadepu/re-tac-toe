package com.game.re_tac_toe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
public class LoginRequest {
    private String username;
    private String password;
}
