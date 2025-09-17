package com.game.re_tac_toe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GameForfeitDto {
    private String message;
    private String winnerUserName;
    private int winnerScore;
    private int loserScore;
}
