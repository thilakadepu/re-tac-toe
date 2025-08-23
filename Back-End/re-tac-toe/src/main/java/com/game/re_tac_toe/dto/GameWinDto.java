package com.game.re_tac_toe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GameWinDto {
    private String winnerUsername;
    private String loserUsername;
    private List<Integer> winningCombination;
}
