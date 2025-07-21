package com.game.re_tac_toe.config;

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

@Component
public class AuthChannelInterceptor implements ChannelInterceptor {

    private final AuthenticationService authenticationService;

    public AuthChannelInterceptor(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        System.out.println("AuthChannelInterceptor processing command: " + accessor.getCommand());

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            System.out.println("AuthChannelInterceptor processing command: " + accessor.getCommand());

            String authorizationHeader = accessor.getFirstNativeHeader("Authorization");
            System.out.println("Authorization Header: " + authorizationHeader);

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String jwt = authorizationHeader.substring(7);
                System.out.println("Extracted JWT: " + jwt);

                try {
                    UserDetails userDetails = authenticationService.validateToken(jwt);
                    System.out.println("Token validated for user: " + userDetails.getUsername());

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());


                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    accessor.setUser(authentication);
                    System.out.println("User set in SecurityContext and WebSocket session.");
                } catch (Exception e) {
                    System.err.println("!!! Token validation failed: " + e.getMessage());
                }
            } else {
                System.err.println("!!! No 'Authorization: Bearer <token>' header found in STOMP CONNECT frame.");
            }
        }
        return message;
    }
}
