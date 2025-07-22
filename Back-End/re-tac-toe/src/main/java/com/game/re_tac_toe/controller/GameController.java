package com.game.re_tac_toe.controller;

import com.game.re_tac_toe.entity.Player;
import com.game.re_tac_toe.repositories.PlayerRepository;
import com.game.re_tac_toe.service.GameService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
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

    @MessageMapping("/game.join")
    public void joinGame(@Payload String avatarName, Principal principal /* here there is one more argument i.e sending a string */) {
        String username = principal.getName();
        Optional<Player> playerOpt = playerRepository.findByUser_Username(username);
        Player player = null;

        if(playerOpt.isPresent()) {
            player = playerOpt.get();
            player.setAvatarName(avatarName);
            playerRepository.save(player);
        }

        gameService.findMatch(player);
    }
}
