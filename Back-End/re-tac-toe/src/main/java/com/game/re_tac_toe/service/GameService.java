package com.game.re_tac_toe.service;

import com.game.re_tac_toe.dto.GameRoomDto;
import com.game.re_tac_toe.dto.PreGameDto;
import com.game.re_tac_toe.entity.GameRoom;
import com.game.re_tac_toe.entity.Player;
import com.game.re_tac_toe.entity.PlayerStatus;
import com.game.re_tac_toe.repositories.GameRoomRepository;
import com.game.re_tac_toe.repositories.PlayerRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {
    private final PlayerRepository playerRepository;
    private final GameRoomRepository gameRoomRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public GameService(PlayerRepository playerRepository, GameRoomRepository gameRoomRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.playerRepository = playerRepository;
        this.gameRoomRepository = gameRoomRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public synchronized void findMatch(Player currentPlayer) {
        Optional<Player> opponentPlayerOpt = playerRepository.findFirstByStatusAndIdNot(PlayerStatus.WAITING, currentPlayer.getId());

        if(opponentPlayerOpt.isPresent()) {
            Player opponent = opponentPlayerOpt.get();

            currentPlayer.setStatus(PlayerStatus.PAIRED);
            opponent.setStatus(PlayerStatus.PAIRED);
            playerRepository.saveAll(List.of(currentPlayer, opponent));

            GameRoom gameRoom = new GameRoom(currentPlayer, opponent);
            gameRoomRepository.save(gameRoom);

            simpMessagingTemplate.convertAndSendToUser(
                    currentPlayer.getUser().getUsername(),
                    "/queue/game.start",
                    new PreGameDto(gameRoom.getId(), gameRoom.getPlayer2().getUser().getUsername(), gameRoom.getPlayer2().getAvatarName())
            );
            simpMessagingTemplate.convertAndSendToUser(
                    opponent.getUser().getUsername(),
                    "/queue/game.start",
                    new PreGameDto(gameRoom.getId(), gameRoom.getPlayer1().getUser().getUsername(), gameRoom.getPlayer1().getAvatarName())
            );
        } else {
            System.out.println("No opponent found for " + currentPlayer.getUser().getUsername() + ". They will continue waiting.");
        }
    }
}
