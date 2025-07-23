package com.game.re_tac_toe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//@AllArgsConstructor
public class GameRoomDto {
    private String currentPlayerName;
    private String currentPlayerAvatarName;
    private String opponentPlayerName;
    private String opponentPlayerAvatarName;

    public GameRoomDto(String currentPlayerName, String currentPlayerAvatarName, String opponentPlayerName, String opponentPlayerAvatarName) {
        this.currentPlayerName = currentPlayerName;
        this.currentPlayerAvatarName = currentPlayerAvatarName;
        this.opponentPlayerName = opponentPlayerName;
        this.opponentPlayerAvatarName = opponentPlayerAvatarName;
    }
}
