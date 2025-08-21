package com.game.re_tac_toe.dto;

import com.game.re_tac_toe.entity.GameRoom;
import com.game.re_tac_toe.entity.Player;
import com.game.re_tac_toe.entity.enums.GameStatus;
import lombok.Data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Data
public class GameUpdateDto {
    private String roomId;
    private GameStatus status;
    private List<Character> board;
    private GamePlayerInfoDto currentPlayer;
    private GamePlayerInfoDto opponentPlayer;
    private String currentPlayerToken;
    private boolean isMyTurn;

    public GameUpdateDto(GameRoom gameRoom, Player perspectiveOfPlayer) {
        this.roomId = gameRoom.getId();
        this.status = gameRoom.getStatus();
        this.board = gameRoom.getBoard();

        if (gameRoom.getPlayer1().getId().equals(perspectiveOfPlayer.getId())) {
            this.currentPlayer = new GamePlayerInfoDto(gameRoom.getPlayer1());
            this.opponentPlayer = new GamePlayerInfoDto(gameRoom.getPlayer2());
            this.currentPlayerToken = gameRoom.getPlayer1Token();
            this.isMyTurn = gameRoom.isPlayer1Turn();
        } else {
            this.currentPlayer = new GamePlayerInfoDto(gameRoom.getPlayer2());
            this.opponentPlayer = new GamePlayerInfoDto(gameRoom.getPlayer1());
            this.currentPlayerToken = gameRoom.getPlayer2Token();
            this.isMyTurn = gameRoom.isPlayer2Turn();
        }
    }
}
