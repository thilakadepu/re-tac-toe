package com.game.re_tac_toe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChoiceRequestDto {
    private String roomId;
    private String username;
    private String choiceToken;
}
