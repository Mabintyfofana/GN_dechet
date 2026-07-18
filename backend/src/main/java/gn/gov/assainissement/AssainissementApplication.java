package gn.gov.assainissement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * ============================================================
 *  POINT D'ENTRÉE - SYSTÈME DE GESTION DES DÉCHETS
 * ============================================================
 *  Projet    : GN_Déchet - Guinée Numérique
 *  Version   : 1.0.0-SNAPSHOT
 *  Framework : Spring Boot 3.3 / Java 17
 *  Auteur    : Équipe GN_Déchet
 * ============================================================
 *
 *  Architecture :
 *    ┌──────────────────────────────────────────────────┐
 *    │  CLIENT (Web / Mobile)                           │
 *    │       ↕ HTTPS / REST (JSON)                      │
 *    │  Spring Security  ←→  JWT Filter                 │
 *    │       ↕                                          │
 *    │  Controller  →  Service  →  Repository  →  BD    │
 *    │                               (JPA/Hibernate)    │
 *    │                                  ↕               │
 *    │                           PostgreSQL 15+         │
 *    └──────────────────────────────────────────────────┘
 *
 *  Packages :
 *    gn.gov.assainissement
 *    ├── config/         → Configuration Spring (Security, JWT, Swagger)
 *    ├── controller/     → Contrôleurs REST (@RestController)
 *    ├── service/        → Logique métier (@Service)
 *    │   └── impl/       → Implémentations des services
 *    ├── repository/     → Couche d'accès données (Spring Data JPA)
 *    ├── entity/         → Entités JPA (@Entity)
 *    ├── dto/            → Objets de transfert de données
 *    │   ├── request/    → DTOs entrants (requêtes)
 *    │   └── response/   → DTOs sortants (réponses)
 *    ├── mapper/         → Mappers MapStruct (Entity ↔ DTO)
 *    ├── security/       → Composants JWT et UserDetails
 *    ├── exception/      → Exceptions personnalisées et handlers
 *    └── util/           → Classes utilitaires
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class AssainissementApplication {

    public static void main(String[] args) {
        SpringApplication.run(AssainissementApplication.class, args);
    }
}
