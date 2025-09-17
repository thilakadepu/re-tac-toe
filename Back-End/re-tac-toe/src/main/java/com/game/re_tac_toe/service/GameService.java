package com.game.re_tac_toe.service;

import com.game.re_tac_toe.entity.Player;

import java.security.Principal;
import java.util.UUID;

public interface GameService {

    void findMatch(Player currentPlayer);

    void playerReady(String roomId, UUID userId);

    void setPlayerChoice(String roomId, UUID userId, String choice);

    void makeMove(String roomId, UUID userId, int position);

    void requestRematch(String roomId, UUID userId);

    void respondToRematch(String roomId, UUID userId, boolean accept);

    void handleDisconnect(Principal principal);
}
