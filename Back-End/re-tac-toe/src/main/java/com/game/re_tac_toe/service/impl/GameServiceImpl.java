package com.game.re_tac_toe.service.impl;

import com.game.re_tac_toe.dto.*;
import com.game.re_tac_toe.entity.GameRoom;
import com.game.re_tac_toe.entity.Player;
import com.game.re_tac_toe.entity.enums.ChoiceRole;
import com.game.re_tac_toe.entity.enums.GameStatus;
import com.game.re_tac_toe.entity.enums.PlayerStatus;
import com.game.re_tac_toe.repository.GameRoomRepository;
import com.game.re_tac_toe.repository.PlayerRepository;
import com.game.re_tac_toe.service.GameService;
import com.game.re_tac_toe.util.GameLogicUtil;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.game.re_tac_toe.util.GameLogicUtil.checkForWin;

@Service
@Slf4j
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
    public void findMatch(Player currentPlayer) {
        Optional<Player> opponentPlayerOpt = playerRepository.findFirstByStatusAndIdNot(PlayerStatus.WAITING, currentPlayer.getId());

        if(opponentPlayerOpt.isPresent()) {
            Player opponent = opponentPlayerOpt.get();

            currentPlayer.setStatus(PlayerStatus.PAIRED);
            opponent.setStatus(PlayerStatus.PAIRED);
            playerRepository.saveAll(List.of(currentPlayer, opponent));

            GameRoom gameRoom = new GameRoom(currentPlayer, opponent);
            gameRoomRepository.save(gameRoom);
            log.info("DATABASE: GameRoom created and saved with ID: {}", gameRoom.getId());

            RedirectToRoomDto player1 = new RedirectToRoomDto(
                    currentPlayer.getUser().getDisplayName(),
                    currentPlayer.getAvatarName(),
                    opponent.getUser().getDisplayName(),
                    opponent.getAvatarName(),
                    gameRoom.getId()
            );

            RedirectToRoomDto player2 = new RedirectToRoomDto(
                    opponent.getUser().getDisplayName(),
                    opponent.getAvatarName(),
                    currentPlayer.getUser().getDisplayName(),
                    currentPlayer.getAvatarName(),
                    gameRoom.getId()
            );

            simpMessagingTemplate.convertAndSendToUser( currentPlayer.getUser().getUsername(),"/queue/match/found",player1);
            simpMessagingTemplate.convertAndSendToUser(opponent.getUser().getUsername(),"/queue/match/found",player2);
        } else {
            log.info("No opponent found for {}. They will continue waiting.", currentPlayer.getUser().getDisplayName());
        }
    }

    @Override
    @Transactional
    public void playerReady(String roomId, UUID userId) {
        GameRoom gameRoom = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalStateException("GameRoom not found with id: " + roomId));

        UUID player1Id = gameRoom.getPlayer1().getUser().getId();
        UUID player2Id = gameRoom.getPlayer2().getUser().getId();

        if (!player1Id.equals(userId) && !player2Id.equals(userId)) {
            log.error("SECURITY VIOLATION: User {} tried to ready up for a game they are not in.", userId);
            return;
        }

        if (player1Id.equals(userId)) {
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

            simpMessagingTemplate.convertAndSendToUser(gameRoom.getPlayer1().getUser().getUsername(),"/queue/ready/updates",new ReadyUpdateResponseDto("SUCCESS"));
            simpMessagingTemplate.convertAndSendToUser(gameRoom.getPlayer2().getUser().getUsername(),"/queue/ready/updates",new ReadyUpdateResponseDto("SUCCESS"));

            simpMessagingTemplate.convertAndSendToUser(gameRoom.getPlayer1().getUser().getUsername(), "/queue/choice", new ChoiceRoleResponseDto(isPlayer1Chooser ? ChoiceRole.CHOOSER : ChoiceRole.NON_CHOOSER));
            simpMessagingTemplate.convertAndSendToUser(gameRoom.getPlayer2().getUser().getUsername(), "/queue/choice", new ChoiceRoleResponseDto(isPlayer1Chooser ? ChoiceRole.NON_CHOOSER : ChoiceRole.CHOOSER));
        }
    }

    @Override
    @Transactional
    public void setPlayerChoice(String roomId, UUID userId, String choice) {
        GameRoom gameRoom = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalStateException("GameRoom not found with id: " + roomId));

        Player player = playerRepository.findByUser_Id(userId)
                .orElseThrow(() -> new IllegalStateException("Player not found with user ID: " + userId));

        if (!gameRoom.getChooserPlayer().getUser().getId().equals(userId)) {
            log.info("SECURITY VIOLATION: Player {} is not authorized to choose the token.", userId);
            return;
        }

        char token = Character.toUpperCase(choice.trim().charAt(0));
        if (token != 'X' && token != 'O') {
            log.error("Invalid token choice by {}: {}", userId, token);
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

        log.info("Token chosen: {} choose {}, assigned to {} / {} assigned to {}",
                chooser.getUser().getDisplayName(), token, chooser.getUser().getDisplayName(), token == 'X' ? 'O' : 'X', nonChooser.getUser().getDisplayName());

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

        Player player1 = gameRoom.getPlayer1();
        Player player2 = gameRoom.getPlayer2();

        GameUpdateDto updateForPlayer1 = new GameUpdateDto(gameRoom, player1);
        GameUpdateDto updateForPlayer2 = new GameUpdateDto(gameRoom, player2);

        simpMessagingTemplate.convertAndSendToUser(player1.getUser().getUsername(), "/queue/game/update", updateForPlayer1);
        simpMessagingTemplate.convertAndSendToUser(player2.getUser().getUsername(), "/queue/game/update", updateForPlayer2);
    }

    @Override
    @Transactional
    public void makeMove(String roomId, UUID userId, int position) {
        GameRoom gameRoom = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalStateException("GameRoom not found with id: " + roomId));

        if (gameRoom.getStatus() != GameStatus.IN_PROGRESS) {
            log.error("Move attempted in a game that is not in progress.");
            return;
        }

        boolean isPlayer1 = gameRoom.getPlayer1().getUser().getId().equals(userId);
        boolean isPlayer2 = gameRoom.getPlayer2().getUser().getId().equals(userId);
        if (!isPlayer1 && !isPlayer2) {
            log.error("SECURITY VIOLATION: User " + userId + " tried to move in a game they are not in.");
            return;
        }

        if ((isPlayer1 && !gameRoom.isPlayer1Turn()) || (isPlayer2 && !gameRoom.isPlayer2Turn())) {
            log.error("Move attempted out of turn by user: " + userId);
            return;
        }

        if (position < 0 || position > 8 || gameRoom.getBoard().get(position) != '_') {
            log.error("Invalid move to position " + position + " by user: " + userId);
            return;
        }

        char token = isPlayer1 ? gameRoom.getPlayer1Token().charAt(0) : gameRoom.getPlayer2Token().charAt(0);
        gameRoom.getBoard().set(position, token);
        gameRoom.getMoveHistory().add(position);
        log.info(gameRoom.getBoard().toString());
        log.info(gameRoom.getMoveHistory().toString());

        if (checkForWin(gameRoom.getBoard(), token)) {
            gameRoom.setStatus(GameStatus.FINISHED);

            List<Integer> winningCombo = GameLogicUtil.getWinningCombination(gameRoom.getBoard(), token);
            if (winningCombo != null) {
                gameRoom.setWinningCombination(winningCombo);

                String winnerUsername;
                String loserUsername;

                if (isPlayer1) {
                    gameRoom.setPlayer1Score(gameRoom.getPlayer1Score() + 1);
                    winnerUsername = gameRoom.getPlayer1().getUser().getDisplayName();
                    loserUsername = gameRoom.getPlayer2().getUser().getDisplayName();
                } else {
                    gameRoom.setPlayer2Score(gameRoom.getPlayer2Score() + 1);
                    winnerUsername = gameRoom.getPlayer2().getUser().getDisplayName();
                    loserUsername = gameRoom.getPlayer1().getUser().getDisplayName();
                }

                int winnerScore = isPlayer1 ? gameRoom.getPlayer1Score() : gameRoom.getPlayer2Score();
                int loserScore = isPlayer1 ? gameRoom.getPlayer2Score() : gameRoom.getPlayer1Score();

                GameWinDto winDto = new GameWinDto(
                        winnerUsername,
                        loserUsername,
                        winningCombo,
                        winnerScore,
                        loserScore
                );

                log.info("Game win detected. Winner: {}. Room: {}", winnerUsername, roomId);

                simpMessagingTemplate.convertAndSendToUser(
                        gameRoom.getPlayer1().getUser().getUsername(),
                        "/queue/game/win",
                        winDto
                );
                simpMessagingTemplate.convertAndSendToUser(
                        gameRoom.getPlayer2().getUser().getUsername(),
                        "/queue/game/win",
                        winDto
                );
            }
            
        } else {
            gameRoom.setPlayer1Turn(!gameRoom.isPlayer1Turn());
            gameRoom.setPlayer2Turn(!gameRoom.isPlayer2Turn());

            if (gameRoom.getMoveHistory().size() == 9) {
                int oldestMovePosition = gameRoom.getMoveHistory().removeFirst();
                gameRoom.getBoard().set(oldestMovePosition, '_');
                log.info("Board was full. Clearing oldest move at position: {}", oldestMovePosition);
                log.info(gameRoom.getBoard().toString());
                log.info(gameRoom.getMoveHistory().toString());
            }
        }

        gameRoomRepository.save(gameRoom);

        Player player1 = gameRoom.getPlayer1();
        Player player2 = gameRoom.getPlayer2();

        GameUpdateDto updateForPlayer1 = new GameUpdateDto(gameRoom, player1);
        GameUpdateDto updateForPlayer2 = new GameUpdateDto(gameRoom, player2);

        simpMessagingTemplate.convertAndSendToUser(player1.getUser().getUsername(), "/queue/game/update", updateForPlayer1);
        simpMessagingTemplate.convertAndSendToUser(player2.getUser().getUsername(), "/queue/game/update", updateForPlayer2);
    }

    @Override
    @Transactional
    public void requestRematch(String roomId, UUID userId) {
        GameRoom gameRoom = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalStateException("GameRoom not found with id: " + roomId));

        if (gameRoom.getStatus() != GameStatus.FINISHED) {
            log.error("Play again requested for a game not finished.");
            return;
        }

        boolean isPlayer1 = gameRoom.getPlayer1().getUser().getId().equals(userId);
        if (isPlayer1) {
            gameRoom.setPlayer1WantsRematch(true);
        } else {
            gameRoom.setPlayer2WantsRematch(true);
        }

        gameRoomRepository.save(gameRoom);

        Player opponent = isPlayer1 ? gameRoom.getPlayer2() : gameRoom.getPlayer1();
        String requesterUsername = isPlayer1 ? gameRoom.getPlayer1().getUser().getUsername() : gameRoom.getPlayer2().getUser().getDisplayName();

        log.info("Player {} requested a rematch. Notifying opponent {}.", requesterUsername, opponent.getUser().getDisplayName());

        simpMessagingTemplate.convertAndSendToUser(
                opponent.getUser().getUsername(),
                "/queue/rematch/request",
                new RematchRequestDto(requesterUsername, roomId)
        );
    }

    @Override
    @Transactional
    public void respondToRematch(String roomId, UUID userId, boolean accept) {
        GameRoom gameRoom = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalStateException("GameRoom not found with id: " + roomId));

        Player player1 = gameRoom.getPlayer1();
        Player player2 = gameRoom.getPlayer2();

        boolean isPlayer = player1.getUser().getId().equals(userId) || player2.getUser().getId().equals(userId);
        if(!isPlayer) {
            log.error("SECURITY VIOLATION: User {} tried to respond to a rematch they are not in.", userId);
            return;
        }

        if (!accept) {
            simpMessagingTemplate.convertAndSendToUser(
                    player1.getUser().getUsername(), "/queue/rematch/response", new RematchResponseDto(false)
            );
            simpMessagingTemplate.convertAndSendToUser(
                    player2.getUser().getUsername(), "/queue/rematch/response", new RematchResponseDto(false)
            );
            return;
        }

        gameRoom.setStatus(GameStatus.IN_PROGRESS);
        gameRoom.setBoard(new ArrayList<>(Arrays.asList('_','_','_','_','_','_','_','_','_')));
        gameRoom.setMoveHistory(new LinkedList<>());
        gameRoom.setWinningCombination(null);
        gameRoom.setPlayer1WantsRematch(false);
        gameRoom.setPlayer2WantsRematch(false);

        gameRoomRepository.save(gameRoom);

        GameUpdateDto updateForPlayer1 = new GameUpdateDto(gameRoom, player1);
        GameUpdateDto updateForPlayer2 = new GameUpdateDto(gameRoom, player2);

        simpMessagingTemplate.convertAndSendToUser(player1.getUser().getUsername(), "/queue/game/update", updateForPlayer1);
        simpMessagingTemplate.convertAndSendToUser(player2.getUser().getUsername(), "/queue/game/update", updateForPlayer2);
    }

}
