package com.game.re_tac_toe.controller;

import com.game.re_tac_toe.dto.ChoiceRequestDto;
import com.game.re_tac_toe.dto.MakeMoveRequestDto;
import com.game.re_tac_toe.dto.RematchRequestPayload;
import com.game.re_tac_toe.dto.RematchResponsePayload;
import com.game.re_tac_toe.entity.Player;
import com.game.re_tac_toe.entity.User;
import com.game.re_tac_toe.repository.PlayerRepository;
import com.game.re_tac_toe.service.GameService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Optional;

@Controller
public class GameController {
    private final GameService gameService;
    private final PlayerRepository playerRepository;

    public GameController(GameService gameService, PlayerRepository playerRepository) {
        this.gameService = gameService;
        this.playerRepository = playerRepository;
    }

    private User getUserFromPrincipal(Principal principal) {
        if (principal == null) {
            return  null;
        }
        return (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
    }

    @MessageMapping("/game/join")
    public void joinGame(@Payload String avatarName, Principal principal) {
        User user = getUserFromPrincipal(principal);
        if (user == null) {
            System.err.println("Cannot join game without authenticated principal.");
            return;
        }

        Optional<Player> playerOpt = playerRepository.findByUser_Id(user.getId());
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            player.setAvatarName(avatarName);
            playerRepository.save(player);
            gameService.findMatch(player);
        } else {
            System.err.println("CRITICAL: Player not found for user " + user.getId() + " in joinGame.");
            Player player = new Player(avatarName, user);
            playerRepository.save(player);
            gameService.findMatch(player);
        }
    }

    @MessageMapping("/game/ready")
    public void playerReady(@Payload String roomId, Principal principal) {
        User user = getUserFromPrincipal(principal);
        if (user == null) {
            System.err.println("Cannot ready up without authenticated principal.");
            return;
        }

        System.out.println("Room :  " + roomId);
        gameService.playerReady(roomId, user.getId());
    }

    @MessageMapping("/game/choice")
    public void playerChoice(@Payload ChoiceRequestDto choiceRequestDto, Principal principal) {
        User user = getUserFromPrincipal(principal);
        if (user == null) {
            System.err.println("Cannot ready up without authenticated principal.");
            return;
        }

        System.out.println("Choice picked : " + choiceRequestDto.getChoiceToken());
        gameService.setPlayerChoice(choiceRequestDto.getRoomId(), user.getId(), choiceRequestDto.getChoiceToken());
    }

    @MessageMapping("/game/move")
    public void makeMove(@Payload MakeMoveRequestDto request, Principal principal) {
        User user = getUserFromPrincipal(principal);
        if (user == null) {
            System.err.println("Cannot make move without authenticated principal.");
            return;
        }
        gameService.makeMove(request.getRoomId(), user.getId(), request.getPosition());
    }

    @MessageMapping("/game/rematch/request")
    public void sendRematchRequest(@Payload RematchRequestPayload payload, Principal principal) {
        User user = getUserFromPrincipal(principal);
        if (user == null) {
            System.err.println("Unauthorized play again request.");
            return;
        }

        gameService.requestRematch(payload.getRoomId(), user.getId());
    }

    @MessageMapping("/game/rematch/respond")
    public void handleRematchResponse(@Payload RematchResponsePayload payload, Principal principal) {
        User user = getUserFromPrincipal(principal);
        if (user == null) {
            System.err.println("Unauthorized play again response.");
            return;
        }

        System.out.println(payload.toString());
        gameService.respondToRematch(payload.getRoomId(), user.getId(), payload.isAccepted());
    }
}
