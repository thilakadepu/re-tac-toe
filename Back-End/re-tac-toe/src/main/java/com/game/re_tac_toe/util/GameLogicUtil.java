package com.game.re_tac_toe.util;

import java.util.ArrayList;
import java.util.List;

public class GameLogicUtil {
    private static final int[][] winCombos = {
            {0, 1, 2}, {3, 4, 5}, {6, 7, 8},
            {0, 3, 6}, {1, 4, 7}, {2, 5, 8},
            {0, 4, 8}, {2, 4, 6}
    };

    public static boolean checkForWin(List<Character> board, char token) {
        for (int[] combo : winCombos) {
            if (board.get(combo[0]) == token &&
                    board.get(combo[1]) == token &&
                    board.get(combo[2]) == token) {
                return true;
            }
        }
        return false;
    }

    public static List<Integer> getWinningCombination(List<Character> board, char token) {
        for (int[] combo : winCombos) {
            if (board.get(combo[0]) == token &&
                    board.get(combo[1]) == token &&
                    board.get(combo[2]) == token) {
                return new ArrayList<>(List.of(combo[0], combo[1], combo[2]));
            }
        }
        return null;
    }
}
