package com.game.re_tac_toe.entity;

import com.game.re_tac_toe.entity.enums.GameStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//import java.util.Arrays;
import java.util.Arrays;
import java.util.UUID;

@Entity
@Table(name = "game_rooms")
@Getter
@Setter
@NoArgsConstructor
public class GameRoom {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player1_id")
    private Player player1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player2_id")
    private Player player2;

    @Enumerated(EnumType.STRING)
    private GameStatus status;

    private char[][] board;

    private boolean player1Ready;
    private boolean player2Ready;

    public GameRoom(Player player1, Player player2) {
        this.id = UUID.randomUUID().toString();
        this.player1 = player1;
        this.player2 = player2;
        this.status = GameStatus.PENDING_READY;

        this.player1Ready = false;
        this.player2Ready = false;

        this.board = new char[3][3];
        for (char[] row : this.board) {
            Arrays.fill(row, '_');
        }
    }

    public String getId() {
        return this.id;
    }

    public Player getPlayer1() {
        return this.player1;
    }

    public Player getPlayer2() {
        return this.player2;
    }

    public GameStatus getStatus() {
        return this.status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    public boolean isPlayer1Ready() {
        return this.player1Ready;
    }

    public boolean isPlayer2Ready() {
        return this.player2Ready;
    }

    public void setPlayer1Ready(boolean b) {
        this.player1Ready = b;
    }

    public void setPlayer2Ready(boolean b) {
        this.player2Ready = b;
    }
}
