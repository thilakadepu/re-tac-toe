package com.game.re_tac_toe.service;

import com.game.re_tac_toe.entity.Player;

public interface GameService {

    void findMatch(Player currentPlayer);

    void playerReady(String roomId, String username);

    void setPlayerChoice(String roomId, String username, String choice);

    public void makeMove(String roomId, String username, int position);
}
