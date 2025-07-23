package com.game.re_tac_toe.mapper;

import com.game.re_tac_toe.dto.GameRoomDto;
import com.game.re_tac_toe.entity.GameRoom;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GameRoomMapper {
    GameRoomDto toDto(GameRoom gameRoom);

    GameRoom toEntity(GameRoomDto gameRoomDto);
}
