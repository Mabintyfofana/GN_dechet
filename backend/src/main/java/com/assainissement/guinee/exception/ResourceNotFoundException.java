package com.assainissement.guinee.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception levée quand une ressource demandée n'est pas trouvée en base.
 * Retourne automatiquement un HTTP 404.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String ressource, String id) {
        super(ressource + " introuvable avec l'identifiant : " + id);
    }
}
