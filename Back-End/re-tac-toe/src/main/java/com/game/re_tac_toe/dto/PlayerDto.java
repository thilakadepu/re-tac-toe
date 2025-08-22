package com.game.re_tac_toe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class PlayerDto {
    private UUID id;
    private String username;
}
