package com.game.re_tac_toe.repository;

import com.game.re_tac_toe.entity.GameRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRoomRepository extends JpaRepository<GameRoom, String> {
}
