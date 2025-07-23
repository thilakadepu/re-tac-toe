package com.game.re_tac_toe.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class BoardConverter implements AttributeConverter<char[][], String> {
    private static final int BOARD_SIZE = 3;

    @Override
    public String convertToDatabaseColumn(char[][] attribute) {
        if (attribute == null) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < BOARD_SIZE; i++) {
            for (int j = 0; j < BOARD_SIZE; j++) {
                sb.append(attribute[i][j] == '\0' ? '_' : attribute[i][j]);
            }
        }
        return sb.toString();
    }

    @Override
    public char[][] convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        char[][] board = new char[BOARD_SIZE][BOARD_SIZE];
        for (int i = 0; i < dbData.length(); i++) {
            int row = i / BOARD_SIZE;
            int col = i % BOARD_SIZE;
            board[row][col] = dbData.charAt(i);
        }
        return board;
    }
}
