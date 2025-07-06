package com.game.re_tac_toe.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

   @GetMapping("/hello")
   public String sayHello() {
       return "Hello from backend!";
   }

}
