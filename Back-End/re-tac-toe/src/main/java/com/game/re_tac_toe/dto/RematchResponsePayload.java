package com.game.re_tac_toe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RematchResponsePayload {
    private String roomId;
    private boolean accepted;
}
