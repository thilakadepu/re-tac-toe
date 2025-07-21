package com.game.re_tac_toe.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class HelloController {

    @MessageMapping("/hello")
    public void sayHello(@Payload String message, Principal principal) {
        if (principal != null) {
            System.out.println("Received message from user: " + principal.getName());
            System.out.println("Message content: " + message);
        } else {
            System.out.println("Received message from an anonymous user.");
        }
    }
}
