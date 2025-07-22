package com.game.re_tac_toe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    private String board;

    private String currentPlayerUsername;

    public GameRoom(Player player1, Player player2) {
        this.id = UUID.randomUUID().toString();
        this.player1 = player1;
        this.player2 = player2;
        this.status = GameStatus.IN_PROGRESS;
        this.board = "_________"; // Empty board
        this.currentPlayerUsername = player1.getUser().getUsername();
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

    public String getBoard() {
        return this.board;
    }

    public String getCurrentPlayerUsername() {
        return this.currentPlayerUsername;
    }
}
