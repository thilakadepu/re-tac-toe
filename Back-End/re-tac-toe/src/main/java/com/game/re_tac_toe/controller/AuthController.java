package com.game.re_tac_toe.controller;

import com.game.re_tac_toe.dto.AuthResponse;
import com.game.re_tac_toe.dto.LoginRequest;
import com.game.re_tac_toe.dto.UserDto;
import com.game.re_tac_toe.entity.User;
import com.game.re_tac_toe.security.JwtAuthenticationFilter;
import com.game.re_tac_toe.service.AuthenticationService;
import com.game.re_tac_toe.service.UserService;
import org.apache.coyote.Response;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
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

    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        if (userService.isUserPresent(userDto.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        User user = new User(userDto.getUsername(), userDto.getPassword());
        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        UserDetails userDetails = authenticationService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
        String tokenValue = authenticationService.generateToken(userDetails);
        AuthResponse response = new AuthResponse(tokenValue, 86400);
        return ResponseEntity.ok(response);
    }
}
