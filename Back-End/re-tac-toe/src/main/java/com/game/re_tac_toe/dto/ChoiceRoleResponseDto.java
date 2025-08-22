package com.game.re_tac_toe.dto;

import com.game.re_tac_toe.entity.enums.ChoiceRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChoiceRoleResponseDto {
    private ChoiceRole role;
}
