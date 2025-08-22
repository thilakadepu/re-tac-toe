package com.game.re_tac_toe.entity;

import com.game.re_tac_toe.entity.enums.GameStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

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

    @ElementCollection
    @OrderColumn
    private List<Character> board;

    private boolean player1Ready;
    private boolean player2Ready;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chooser_player_id")
    private Player chooserPlayer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "non_chooser_player_id")
    private Player nonChooserPlayer;

    @Column(length = 1)
    private String player1Token;

    @Column(length = 1)
    private String player2Token;

    private boolean player1Turn;
    private boolean player2Turn;

    @ElementCollection
    @OrderColumn
    private List<Integer> moveHistory = new ArrayList<>();

    @ElementCollection
    @OrderColumn
    private List<Integer> winningCombination = new ArrayList<>();

    public GameRoom(Player player1, Player player2) {
        this.id = UUID.randomUUID().toString();
        this.player1 = player1;
        this.player2 = player2;
        this.status = GameStatus.PENDING_READY;
        this.player1Ready = false;
        this.player2Ready = false;
        this.board = new ArrayList<>(Collections.nCopies(9, '_'));
    }
}
