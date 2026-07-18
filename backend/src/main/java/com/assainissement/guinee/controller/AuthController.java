package com.assainissement.guinee.controller;

import com.assainissement.guinee.dto.InscriptionRequest;
import com.assainissement.guinee.dto.LoginRequest;
import com.assainissement.guinee.dto.LoginResponse;
import com.assainissement.guinee.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints publics d'authentification.
 * Accessible sans token JWT.
 *
 * POST /api/auth/inscription  → Créer un compte
 * POST /api/auth/connexion    → Se connecter (retourne le token JWT)
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/inscription")
    public ResponseEntity<String> inscrire(@Valid @RequestBody InscriptionRequest request) {
        authService.inscrire(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Compte créé avec succès. Vous pouvez maintenant vous connecter.");
    }

    @PostMapping("/connexion")
    public ResponseEntity<LoginResponse> connecter(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.connecter(request);
        return ResponseEntity.ok(response);
    }
}
