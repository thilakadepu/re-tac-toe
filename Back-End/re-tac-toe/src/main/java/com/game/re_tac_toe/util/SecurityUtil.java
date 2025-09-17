package com.game.re_tac_toe.util;

import com.game.re_tac_toe.entity.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.security.Principal;

public class SecurityUtil {
    private SecurityUtil() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    public static User getUserFromPrincipal(Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            Object principalObject = ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            if (principalObject instanceof User) {
                return (User) principalObject;
            }
        }
        return null;
    }
}
