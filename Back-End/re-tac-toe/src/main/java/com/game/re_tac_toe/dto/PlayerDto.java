package com.game.re_tac_toe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class PlayerDto {
    private UUID id;
    private String username;
}
