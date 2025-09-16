package com.game.re_tac_toe.controller;

import com.game.re_tac_toe.dto.AuthResponse;
import com.game.re_tac_toe.dto.UserDto;
import com.game.re_tac_toe.entity.User;
import com.game.re_tac_toe.service.AuthenticationService;
import com.game.re_tac_toe.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/")
public class AuthController {
    private final UserService userService;
    private final AuthenticationService authenticationService;

    public AuthController(UserService userService, AuthenticationService authenticationService) {
        this.userService = userService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/guest/register")
    public ResponseEntity<AuthResponse> registerGuest(@RequestBody UserDto userDto) {
        User newUser = userService.saveGuest(userDto);
        String tokenValue = authenticationService.generateToken(newUser);
        AuthResponse authResponse = new AuthResponse(tokenValue, 86400);
        return ResponseEntity.ok(authResponse);
    }
}
