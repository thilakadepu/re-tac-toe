package com.game.re_tac_toe.security;

import com.game.re_tac_toe.entity.Player;
import com.game.re_tac_toe.entity.enums.PlayerStatus;
import com.game.re_tac_toe.entity.User;
import com.game.re_tac_toe.repository.PlayerRepository;
import com.game.re_tac_toe.service.AuthenticationService;
import com.game.re_tac_toe.service.GameService;
import com.game.re_tac_toe.util.SecurityUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Optional;

@Component
@Slf4j
public class AuthChannelInterceptor implements ChannelInterceptor {

    private final AuthenticationService authenticationService;
    private final PlayerRepository playerRepository;
    private final GameService gameService;

    public AuthChannelInterceptor(AuthenticationService authenticationService, PlayerRepository playerRepository,@Lazy GameService gameService) {
        this.authenticationService = authenticationService;
        this.playerRepository = playerRepository;
        this.gameService = gameService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authorizationHeader = accessor.getFirstNativeHeader("Authorization");

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String jwt = authorizationHeader.substring(7);

                try {
                    User user = (User) authenticationService.validateToken(jwt);

                    if (user != null) {
                        Player player = playerRepository.findByUser_Id(user.getId())
                                .orElseGet(() -> {
                                    return new Player("Pikachu.png", user);
                                });

                        player.setStatus(PlayerStatus.WAITING);
                        playerRepository.save(player);
                        log.info("Player {} (ID: {}) is now WAITING.", user.getUsername(), user.getId());
                    }

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user, null, user.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    accessor.setUser(authentication);
                } catch (Exception e) {
                    log.error("!!! Token validation failed: {}", e.getMessage(), e);
                }
            } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                if (accessor.getUser() != null) {
                    User user = (User) ((UsernamePasswordAuthenticationToken) accessor.getUser()).getPrincipal();
                    String username = accessor.getUser().getName();
                    Optional<Player> playerOpt = playerRepository.findByUser_Id(user.getId());
                    playerOpt.ifPresent(player -> {
                        player.setStatus(PlayerStatus.OFFLINE);
                        playerRepository.save(player);
                        log.info("Player {} (ID: {}) disconnected.", user.getUsername(), user.getId());
                    });
                }
            }
        } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
            Principal principal = accessor.getUser();
            if (principal != null) {
                User user = SecurityUtil.getUserFromPrincipal(principal);
                if (user == null) {
                    return message;
                }

                Optional<Player> playerOpt = playerRepository.findByUser_Id(user.getId());

                if (playerOpt.isPresent()) {
                    Player player = playerOpt.get();

                    if (player.getStatus() == PlayerStatus.OFFLINE) {
                        log.debug("Player {} is already OFFLINE. Skipping duplicate disconnect event.", user.getId());
                        return message;
                    }

                    gameService.handleDisconnect(principal);
                    player.setStatus(PlayerStatus.OFFLINE);
                    playerRepository.save(player);
                    log.info("Player {} (ID: {}) disconnected and set to OFFLINE.", player.getUser().getDisplayName(), user.getId());
                }
            }
        }
        return message;
    }
}
