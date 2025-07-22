package com.game.re_tac_toe.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PreGameDto {
    private String id;
    private String opponent;
    private String opponentAvatarName;

    public PreGameDto(String id, String username, String opponentAvatarName) {
        this.id = id;
        this.opponent = username;
        this.opponentAvatarName = opponentAvatarName;
    }
}
