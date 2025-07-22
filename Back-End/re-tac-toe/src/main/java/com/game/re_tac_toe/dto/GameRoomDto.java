package com.game.re_tac_toe.dto;

import com.game.re_tac_toe.entity.GameRoom;
import com.game.re_tac_toe.entity.GameStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameRoomDto {
    private String id;
    private PlayerDto player1;
    private PlayerDto player2;
    private GameStatus status;
    private String board;
    private String currentPlayerUsername;

    public GameRoomDto(GameRoom gameRoom) {
        this.id = gameRoom.getId();
        this.player1 = new PlayerDto(gameRoom.getPlayer1().getId(), gameRoom.getPlayer1().getUser().getUsername());
        this.player2 = new PlayerDto(gameRoom.getPlayer2().getId(), gameRoom.getPlayer2().getUser().getUsername());
        this.status = gameRoom.getStatus();
        this.board = gameRoom.getBoard();
        this.currentPlayerUsername = gameRoom.getCurrentPlayerUsername();
    }
}
