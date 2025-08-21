package com.game.re_tac_toe.dto;

import com.game.re_tac_toe.entity.Player;
import lombok.Data;

@Data
public class GamePlayerInfoDto {
    private String username;
    private String avatarName;

    public GamePlayerInfoDto(Player player) {
        this.username = player.getUser().getUsername();
        this.avatarName = player.getAvatarName();
    }
}
