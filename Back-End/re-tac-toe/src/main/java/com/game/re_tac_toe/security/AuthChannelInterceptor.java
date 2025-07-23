package com.game.re_tac_toe.security;

import com.game.re_tac_toe.entity.Player;
import com.game.re_tac_toe.entity.enums.PlayerStatus;
import com.game.re_tac_toe.entity.User;
import com.game.re_tac_toe.repository.PlayerRepository;
import com.game.re_tac_toe.service.AuthenticationService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthChannelInterceptor implements ChannelInterceptor {

    private final AuthenticationService authenticationService;
    private final PlayerRepository playerRepository;

    public AuthChannelInterceptor(AuthenticationService authenticationService, PlayerRepository playerRepository) {
        this.authenticationService = authenticationService;
        this.playerRepository = playerRepository;
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
                    UserDetails userDetails = authenticationService.validateToken(jwt);

                    if (userDetails instanceof User) {
                        User user = (User) userDetails;

                        Player player = playerRepository.findByUser_Username(user.getUsername())
                                .orElseGet(() -> {
                                    return new Player("Pikachu.png", user);
                                });

                        player.setStatus(PlayerStatus.WAITING);
                        playerRepository.save(player);
                        System.out.println("Player " + user.getUsername() + " is now WAITING.");
                    }

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    accessor.setUser(authentication);
                } catch (Exception e) {
                    System.err.println("!!! Token validation failed: " + e.getMessage());
                }
            } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                if (accessor.getUser() != null) {
                    String username = accessor.getUser().getName();
                    Optional<Player> playerOpt = playerRepository.findByUser_Username(username);
                    playerOpt.ifPresent(player -> {
                        player.setStatus(PlayerStatus.OFFLINE);
                        playerRepository.save(player);
                    });
                }
            }
        }
        return message;
    }
}
