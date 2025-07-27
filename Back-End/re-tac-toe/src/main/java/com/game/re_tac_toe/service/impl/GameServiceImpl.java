package com.game.re_tac_toe.service.impl;

import com.game.re_tac_toe.dto.GameRoomDto;
import com.game.re_tac_toe.dto.ReadyUpdateResponseDto;
import com.game.re_tac_toe.dto.RedirectToRoomDto;
import com.game.re_tac_toe.entity.GameRoom;
import com.game.re_tac_toe.entity.Player;
import com.game.re_tac_toe.entity.enums.GameStatus;
import com.game.re_tac_toe.entity.enums.PlayerStatus;
import com.game.re_tac_toe.repository.GameRoomRepository;
import com.game.re_tac_toe.repository.PlayerRepository;
import com.game.re_tac_toe.service.GameService;
import jakarta.transaction.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameServiceImpl implements GameService {
    private final PlayerRepository playerRepository;
    private final GameRoomRepository gameRoomRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public GameServiceImpl(PlayerRepository playerRepository, GameRoomRepository gameRoomRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.playerRepository = playerRepository;
        this.gameRoomRepository = gameRoomRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    @Transactional
    public synchronized void findMatch(Player currentPlayer) {
        Optional<Player> opponentPlayerOpt = playerRepository.findFirstByStatusAndIdNot(PlayerStatus.WAITING, currentPlayer.getId());

        if(opponentPlayerOpt.isPresent()) {
            Player opponent = opponentPlayerOpt.get();

            currentPlayer.setStatus(PlayerStatus.PAIRED);
            opponent.setStatus(PlayerStatus.PAIRED);
            playerRepository.saveAll(List.of(currentPlayer, opponent));

            GameRoom gameRoom = new GameRoom(currentPlayer, opponent);
            gameRoomRepository.save(gameRoom);
            System.out.println("DATABASE: GameRoom created and saved with ID: " + gameRoom.getId());

            RedirectToRoomDto player1 = new RedirectToRoomDto(
                    currentPlayer.getUser().getUsername(),
                    currentPlayer.getAvatarName(),
                    opponent.getUser().getUsername(),
                    opponent.getAvatarName(),
                    gameRoom.getId()
            );

            RedirectToRoomDto player2 = new RedirectToRoomDto(
                    opponent.getUser().getUsername(),
                    opponent.getAvatarName(),
                    currentPlayer.getUser().getUsername(),
                    currentPlayer.getAvatarName(),
                    gameRoom.getId()
            );

            simpMessagingTemplate.convertAndSendToUser( currentPlayer.getUser().getUsername(),"/queue/match/found",player1);
            simpMessagingTemplate.convertAndSendToUser(opponent.getUser().getUsername(),"/queue/match/found",player2);
        } else {
            System.out.println("No opponent found for " + currentPlayer.getUser().getUsername() + ". They will continue waiting.");
        }
    }

    @Override
    @Transactional
    public void playerReady(String roomId, String username) {
        GameRoom gameRoom = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalStateException("GameRoom not found with id: " + roomId));

        String player1Username = gameRoom.getPlayer1().getUser().getUsername();
        String player2Username = gameRoom.getPlayer2().getUser().getUsername();

        if (!player1Username.equals(username) && !player2Username.equals(username)) {
            System.err.println("SECURITY VIOLATION: User " + username + " tried to ready up for a game they are not in.");
            return;
        }

        if (player1Username.equals(username)) {
            gameRoom.setPlayer1Ready(true);
        } else {
            gameRoom.setPlayer2Ready(true);
        }

        gameRoomRepository.save(gameRoom);

        if (gameRoom.isPlayer1Ready() && gameRoom.isPlayer2Ready()) {
            gameRoom.setStatus(GameStatus.IN_PROGRESS);

            gameRoom.getPlayer1().setStatus(PlayerStatus.PLAYING);
            gameRoom.getPlayer2().setStatus(PlayerStatus.PLAYING);

            gameRoomRepository.save(gameRoom);
            playerRepository.saveAll(List.of(gameRoom.getPlayer1(), gameRoom.getPlayer2()));

            simpMessagingTemplate.convertAndSendToUser(player1Username,"/queue/ready/updates",new ReadyUpdateResponseDto("SUCCESS"));
            simpMessagingTemplate.convertAndSendToUser(player2Username,"/queue/ready/updates",new ReadyUpdateResponseDto("SUCCESS"));
        }
    }
}
