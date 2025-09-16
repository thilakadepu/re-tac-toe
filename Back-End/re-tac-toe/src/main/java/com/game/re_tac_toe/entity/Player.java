package com.game.re_tac_toe.entity;

import com.game.re_tac_toe.entity.enums.PlayerStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String avatarName;

    @Enumerated(EnumType.STRING)
    private PlayerStatus status;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    public Player(String avatarName, User user) {
        this.user = user;
        this.avatarName = avatarName;
        this.status = PlayerStatus.WAITING;
    }

}
