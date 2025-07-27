package com.game.re_tac_toe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RedirectToRoomDto {
    private String currentPlayerName;
    private String currentPlayerAvatarName;
    private String opponentPlayerName;
    private String opponentPlayerAvatarName;
    private String roomId;
}
