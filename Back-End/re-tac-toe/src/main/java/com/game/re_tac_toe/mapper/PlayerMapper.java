package com.game.re_tac_toe.mapper;

import com.game.re_tac_toe.dto.PlayerDto;
import com.game.re_tac_toe.entity.Player;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PlayerMapper {
    PlayerDto toDto(Player player);

    Player toEntity(PlayerDto playerDto);
}
