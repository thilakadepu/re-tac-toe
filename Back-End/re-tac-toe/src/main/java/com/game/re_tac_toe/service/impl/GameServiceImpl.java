package com.game.re_tac_toe.service.impl;

import com.game.re_tac_toe.dto.ChoiceResponseDto;
import com.game.re_tac_toe.dto.ChoiceRoleResponseDto;
import com.game.re_tac_toe.dto.ReadyUpdateResponseDto;
import com.game.re_tac_toe.dto.RedirectToRoomDto;
import com.game.re_tac_toe.entity.GameRoom;
import com.game.re_tac_toe.entity.Player;
import com.game.re_tac_toe.entity.enums.ChoiceRole;
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
import java.util.Random;

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

            boolean isPlayer1Chooser = new Random().nextBoolean();
            Player chooser = isPlayer1Chooser ? gameRoom.getPlayer1() : gameRoom.getPlayer2();
            Player nonChooser = isPlayer1Chooser ? gameRoom.getPlayer2() : gameRoom.getPlayer1();

            gameRoom.setChooserPlayer(chooser);
            gameRoom.setNonChooserPlayer(nonChooser);

            gameRoomRepository.save(gameRoom);
            playerRepository.saveAll(List.of(gameRoom.getPlayer1(), gameRoom.getPlayer2()));

            simpMessagingTemplate.convertAndSendToUser(player1Username,"/queue/ready/updates",new ReadyUpdateResponseDto("SUCCESS"));
            simpMessagingTemplate.convertAndSendToUser(player2Username,"/queue/ready/updates",new ReadyUpdateResponseDto("SUCCESS"));

            simpMessagingTemplate.convertAndSendToUser(player1Username, "/queue/choice", new ChoiceRoleResponseDto(isPlayer1Chooser ? ChoiceRole.CHOOSER : ChoiceRole.NON_CHOOSER));
            simpMessagingTemplate.convertAndSendToUser(player2Username, "/queue/choice", new ChoiceRoleResponseDto(isPlayer1Chooser ? ChoiceRole.NON_CHOOSER : ChoiceRole.CHOOSER));
        }
    }

    @Override
    @Transactional
    public void setPlayerChoice(String roomId, String username, String choice) {
        GameRoom gameRoom = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalStateException("GameRoom not found with id: " + roomId));

        Player player = playerRepository.findByUser_Username(username)
                .orElseThrow(() -> new IllegalStateException("Player not found with username: " + username));

        if (!gameRoom.getChooserPlayer().getUser().getUsername().equals(username)) {
            System.err.println("SECURITY VIOLATION: Player " + username + " is not authorized to choose the token.");
            return;
        }

        char token = Character.toUpperCase(choice.trim().charAt(0));
        if (token != 'X' && token != 'O') {
            System.err.println("Invalid token choice by " + username + ": " + token);
            return;
        }

        Player chooser = gameRoom.getChooserPlayer();
        Player nonChooser = gameRoom.getNonChooserPlayer();

        boolean isChooserPlayer1 = chooser.getId().equals(gameRoom.getPlayer1().getId());

        if (isChooserPlayer1) {
            gameRoom.setPlayer1Token(String.valueOf(token));
            gameRoom.setPlayer2Token(String.valueOf(token == 'X' ? 'O' : 'X'));
        } else {
            gameRoom.setPlayer2Token(String.valueOf(token));
            gameRoom.setPlayer1Token(String.valueOf(token == 'X' ? 'O' : 'X'));
        }

        if (isChooserPlayer1) {
            gameRoom.setPlayer1Turn(false);
            gameRoom.setPlayer2Turn(true);
        } else {
            gameRoom.setPlayer1Turn(true);
            gameRoom.setPlayer2Turn(false);
        }

        gameRoomRepository.save(gameRoom);

        System.out.println("Token chosen: " + username + " chose " + token +
                ", assigned to " + chooser.getUser().getUsername() + " / " +
                (token == 'X' ? 'O' : 'X') + " assigned to " + nonChooser.getUser().getUsername());

        simpMessagingTemplate.convertAndSendToUser(
                chooser.getUser().getUsername(),
                "/queue/token",
                new ChoiceResponseDto(token)
        );

        simpMessagingTemplate.convertAndSendToUser(
                nonChooser.getUser().getUsername(),
                "/queue/token",
                new ChoiceResponseDto(token == 'X' ? 'O' : 'X')
        );

    }
}
