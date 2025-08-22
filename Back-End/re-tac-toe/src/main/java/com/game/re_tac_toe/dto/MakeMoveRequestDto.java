package com.game.re_tac_toe.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MakeMoveRequestDto {
    private String roomId;

    @JsonProperty("cellId")
    private int position;
}