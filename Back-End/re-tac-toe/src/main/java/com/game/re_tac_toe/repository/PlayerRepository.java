package com.game.re_tac_toe.repository;

import com.game.re_tac_toe.entity.Player;
import com.game.re_tac_toe.entity.enums.PlayerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PlayerRepository extends JpaRepository<Player, UUID> {
    Optional<Player> findByUser_Id(UUID id);

    Optional<Player> findFirstByStatusAndIdNot(PlayerStatus playerStatus, UUID id);
}