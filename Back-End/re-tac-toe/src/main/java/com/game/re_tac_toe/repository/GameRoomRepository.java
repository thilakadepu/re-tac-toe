package com.game.re_tac_toe.repository;

import com.game.re_tac_toe.entity.GameRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface GameRoomRepository extends JpaRepository<GameRoom, String> {

    @Query("SELECT g FROM GameRoom g WHERE (g.player1.id = :playerId OR g.player2.id = :playerId) AND g.status IN ('IN_PROGRESS', 'PENDING_READY')")
    Optional<GameRoom> findActiveGameByPlayerId(@Param("playerId") UUID playerId);
}
