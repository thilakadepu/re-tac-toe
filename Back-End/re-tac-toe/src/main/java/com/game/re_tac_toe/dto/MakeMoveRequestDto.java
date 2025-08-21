package com.game.re_tac_toe.dto;

import lombok.Data;

@Data
public class MakeMoveRequestDto {
    private String roomId;
    private int position;
}