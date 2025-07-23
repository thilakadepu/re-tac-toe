package com.game.re_tac_toe.mapper;

import org.mapstruct.Mapper;
import com.game.re_tac_toe.dto.UserDto;
import com.game.re_tac_toe.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);

    User toEntity(UserDto userDto);
}
