package com.game.re_tac_toe.entity;

import com.game.re_tac_toe.dto.LoginRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "players")
@Getter
@Setter
@NoArgsConstructor
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String avatarName;

    @Enumerated(EnumType.STRING)
    private PlayerStatus status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_username", referencedColumnName = "username")
    private User user;

    public Player(String avatarName, User user) {
        this.user = user;
        this.avatarName = avatarName;
        this.status = PlayerStatus.WAITING;
    }

    public void setStatus(PlayerStatus playerStatus) {
        this.status = playerStatus;
    }

    public void setAvatarName(String avatarName) {
        this.avatarName = avatarName;
    }

    public User getUser() {
        return this.user;
    }

    public UUID getId() {
        return this.id;
    }

    public String getAvatarName() {
        return this.avatarName;
    }
}
