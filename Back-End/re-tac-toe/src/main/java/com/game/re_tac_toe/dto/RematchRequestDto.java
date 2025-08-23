package com.game.re_tac_toe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RematchRequestDto {
    private String requesterUsername;
    private String roomId;
}
