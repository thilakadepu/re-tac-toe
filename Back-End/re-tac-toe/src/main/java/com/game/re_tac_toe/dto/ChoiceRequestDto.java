package com.game.re_tac_toe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class ChoiceRequestDto {
    private String roomId;
    private String username;
    private String choiceToken;
}
