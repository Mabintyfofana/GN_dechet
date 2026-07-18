-- =============================================================================
-- SCHÉMA DE LA BASE DE DONNÉES - SYSTÈME DE GESTION DES DÉCHETS
-- Projet    : GN_Déchet - Guinée Numérique
-- Version   : 1.0
-- Date      : 2026-07-04
-- Auteur    : Équipe GN_Déchet
-- SGBD      : PostgreSQL 15+
-- =============================================================================

-- Activation de l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =============================================================================
-- TABLE : roles
-- Description : Rôles des utilisateurs dans le système
-- =============================================================================
CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    nom         VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABLE : utilisateurs
-- Description : Comptes utilisateurs du système
-- =============================================================================
CREATE TABLE utilisateurs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom             VARCHAR(100) NOT NULL,
    prenom          VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    telephone       VARCHAR(20),
    mot_de_passe    VARCHAR(255) NOT NULL,       -- hash bcrypt
    role_id         INTEGER NOT NULL REFERENCES roles(id),
    actif           BOOLEAN NOT NULL DEFAULT TRUE,
    date_creation   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    derniere_connexion TIMESTAMP WITH TIME ZONE
);

-- =============================================================================
-- TABLE : zones
-- Description : Zones géographiques de collecte
-- =============================================================================
CREATE TABLE zones (
    id              SERIAL PRIMARY KEY,
    nom             VARCHAR(150) NOT NULL,
    commune         VARCHAR(100) NOT NULL,
    prefecture      VARCHAR(100) NOT NULL,
    region          VARCHAR(100) NOT NULL DEFAULT 'Conakry',
    superficie_km2  NUMERIC(10, 4),
    population      INTEGER,
    actif           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABLE : agents_collecte
-- Description : Agents responsables de la collecte des déchets
-- =============================================================================
CREATE TABLE agents_collecte (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id  UUID NOT NULL UNIQUE REFERENCES utilisateurs(id) ON DELETE CASCADE,
    matricule       VARCHAR(30) NOT NULL UNIQUE,
    zone_id         INTEGER REFERENCES zones(id),
    date_embauche   DATE NOT NULL DEFAULT CURRENT_DATE,
    statut          VARCHAR(20) NOT NULL DEFAULT 'ACTIF'
                        CHECK (statut IN ('ACTIF', 'INACTIF', 'CONGE', 'SUSPENDU')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABLE : menages
-- Description : Foyers/ménages abonnés au service de collecte
-- =============================================================================
CREATE TABLE menages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id  UUID UNIQUE REFERENCES utilisateurs(id) ON DELETE SET NULL,
    nom_chef        VARCHAR(200) NOT NULL,
    telephone       VARCHAR(20) NOT NULL,
    email           VARCHAR(255),
    adresse         TEXT NOT NULL,
    quartier        VARCHAR(100),
    zone_id         INTEGER REFERENCES zones(id),
    latitude        DECIMAL(10, 8),                  -- coordonnée GPS latitude
    longitude       DECIMAL(11, 8),                  -- coordonnée GPS longitude
    nb_membres      INTEGER DEFAULT 1 CHECK (nb_membres >= 1),
    abonne          BOOLEAN NOT NULL DEFAULT FALSE,
    date_inscription TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABLE : types_dechets
-- Description : Catégories de déchets
-- =============================================================================
CREATE TABLE types_dechets (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(20) NOT NULL UNIQUE,
    libelle     VARCHAR(100) NOT NULL,
    couleur_bac VARCHAR(7),                       -- code hex ex: #00FF00
    recyclable  BOOLEAN NOT NULL DEFAULT FALSE,
    dangereux   BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT
);

-- =============================================================================
-- TABLE : collectes
-- Description : Opérations de collecte des déchets
-- =============================================================================
CREATE TABLE collectes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id        UUID NOT NULL REFERENCES agents_collecte(id),
    menage_id       UUID NOT NULL REFERENCES menages(id),
    zone_id         INTEGER NOT NULL REFERENCES zones(id),
    date_collecte   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    statut          VARCHAR(20) NOT NULL DEFAULT 'PLANIFIE'
                        CHECK (statut IN ('PLANIFIE', 'EN_COURS', 'EFFECTUE', 'ECHOUE', 'ANNULE')),
    poids_kg        NUMERIC(8, 2) CHECK (poids_kg >= 0),
    volume_m3       NUMERIC(8, 3) CHECK (volume_m3 >= 0),
    observations    TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABLE : collecte_types_dechets
-- Description : Association collecte <-> types de déchets (relation N:N)
-- =============================================================================
CREATE TABLE collecte_types_dechets (
    collecte_id     UUID NOT NULL REFERENCES collectes(id) ON DELETE CASCADE,
    type_dechet_id  INTEGER NOT NULL REFERENCES types_dechets(id),
    poids_kg        NUMERIC(8, 2) DEFAULT 0,
    PRIMARY KEY (collecte_id, type_dechet_id)
);

-- =============================================================================
-- TABLE : paiements
-- Description : Paiements des abonnements / services
-- =============================================================================
CREATE TABLE paiements (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menage_id       UUID NOT NULL REFERENCES menages(id),
    montant         NUMERIC(12, 2) NOT NULL CHECK (montant > 0),
    devise          VARCHAR(5) NOT NULL DEFAULT 'GNF',
    mode_paiement   VARCHAR(30) NOT NULL
                        CHECK (mode_paiement IN ('ESPECE', 'MOBILE_MONEY', 'VIREMENT', 'CARTE')),
    reference_txn   VARCHAR(100) UNIQUE,           -- référence transaction externe
    periode_debut   DATE NOT NULL,
    periode_fin     DATE NOT NULL,
    statut          VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE'
                        CHECK (statut IN ('EN_ATTENTE', 'VALIDE', 'REFUSE', 'REMBOURSE')),
    date_paiement   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valide_par      UUID REFERENCES utilisateurs(id),
    date_validation TIMESTAMP WITH TIME ZONE,
    notes           TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABLE : reclamations
-- Description : Réclamations et signalements des ménages
-- =============================================================================
CREATE TABLE reclamations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menage_id       UUID NOT NULL REFERENCES menages(id),
    type_reclamation VARCHAR(50) NOT NULL
                        CHECK (type_reclamation IN (
                            'COLLECTE_NON_EFFECTUEE',
                            'RETARD_COLLECTE',
                            'COMPORTEMENT_AGENT',
                            'BRUIT',
                            'DEVERSEMENT_ILLEGAL',
                            'AUTRE'
                        )),
    description     TEXT NOT NULL,
    statut          VARCHAR(20) NOT NULL DEFAULT 'OUVERT'
                        CHECK (statut IN ('OUVERT', 'EN_COURS', 'RESOLU', 'FERME', 'REJETE')),
    priorite        VARCHAR(10) NOT NULL DEFAULT 'NORMALE'
                        CHECK (priorite IN ('BASSE', 'NORMALE', 'HAUTE', 'URGENTE')),
    collecte_id     UUID REFERENCES collectes(id),
    agent_responsable UUID REFERENCES agents_collecte(id),
    date_soumission TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_resolution TIMESTAMP WITH TIME ZONE,
    resolution      TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABLE : notifications
-- Description : Notifications envoyées aux utilisateurs
-- =============================================================================
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id  UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    titre           VARCHAR(200) NOT NULL,
    message         TEXT NOT NULL,
    type_notif      VARCHAR(30) DEFAULT 'INFO'
                        CHECK (type_notif IN ('INFO', 'ALERTE', 'SUCCES', 'ERREUR')),
    lu              BOOLEAN NOT NULL DEFAULT FALSE,
    date_envoi      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_lecture    TIMESTAMP WITH TIME ZONE
);

-- =============================================================================
-- TABLE : tournees
-- Description : Planification des tournées de collecte
-- =============================================================================
CREATE TABLE tournees (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    libelle         VARCHAR(200) NOT NULL,
    zone_id         INTEGER NOT NULL REFERENCES zones(id),
    agent_id        UUID NOT NULL REFERENCES agents_collecte(id),
    date_prevue     DATE NOT NULL,
    heure_debut     TIME,
    heure_fin       TIME,
    statut          VARCHAR(20) NOT NULL DEFAULT 'PLANIFIE'
                        CHECK (statut IN ('PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE')),
    observations    TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABLE : audit_log
-- Description : Journal d'audit des actions sensibles
-- =============================================================================
CREATE TABLE audit_log (
    id              BIGSERIAL PRIMARY KEY,
    utilisateur_id  UUID REFERENCES utilisateurs(id),
    action          VARCHAR(100) NOT NULL,
    table_cible     VARCHAR(100),
    enregistrement_id VARCHAR(100),
    ancienne_valeur JSONB,
    nouvelle_valeur JSONB,
    adresse_ip      INET,
    user_agent      TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEX DE PERFORMANCE
-- =============================================================================
CREATE INDEX idx_utilisateurs_email         ON utilisateurs(email);
CREATE INDEX idx_utilisateurs_role          ON utilisateurs(role_id);
CREATE INDEX idx_agents_zone                ON agents_collecte(zone_id);
CREATE INDEX idx_menages_zone               ON menages(zone_id);
CREATE INDEX idx_collectes_agent            ON collectes(agent_id);
CREATE INDEX idx_collectes_menage           ON collectes(menage_id);
CREATE INDEX idx_collectes_date             ON collectes(date_collecte);
CREATE INDEX idx_collectes_statut           ON collectes(statut);
CREATE INDEX idx_paiements_menage           ON paiements(menage_id);
CREATE INDEX idx_paiements_statut           ON paiements(statut);
CREATE INDEX idx_reclamations_menage        ON reclamations(menage_id);
CREATE INDEX idx_reclamations_statut        ON reclamations(statut);
CREATE INDEX idx_notifications_utilisateur  ON notifications(utilisateur_id);
CREATE INDEX idx_notifications_lu           ON notifications(lu);
CREATE INDEX idx_audit_log_utilisateur      ON audit_log(utilisateur_id);
CREATE INDEX idx_audit_log_created_at       ON audit_log(created_at);
CREATE INDEX idx_tournees_zone              ON tournees(zone_id);
CREATE INDEX idx_tournees_agent             ON tournees(agent_id);
CREATE INDEX idx_tournees_date              ON tournees(date_prevue);

-- =============================================================================
-- DONNÉES DE RÉFÉRENCE INITIALES
-- =============================================================================

-- Rôles système
INSERT INTO roles (nom, description) VALUES
    ('SUPER_ADMIN', 'Administrateur principal avec accès total au système'),
    ('ADMIN',       'Administrateur avec gestion complète des opérations'),
    ('SUPERVISEUR', 'Superviseur de zone responsable du suivi des collectes'),
    ('AGENT',       'Agent de collecte terrain'),
    ('MENAGE',      'Ménage / Foyer abonné au service');

-- Types de déchets
INSERT INTO types_dechets (code, libelle, couleur_bac, recyclable, dangereux) VALUES
    ('ORG',  'Déchets organiques / Biodégradables', '#8B4513', TRUE,  FALSE),
    ('PLAS', 'Plastiques',                          '#FFFF00', TRUE,  FALSE),
    ('PAPI', 'Papier / Carton',                     '#0000FF', TRUE,  FALSE),
    ('META', 'Métaux / Ferraille',                  '#808080', TRUE,  FALSE),
    ('VERR', 'Verre',                               '#00FF00', TRUE,  FALSE),
    ('ELEC', 'Déchets électroniques (DEEE)',        '#FF4500', FALSE, TRUE ),
    ('MEDI', 'Déchets médicaux',                    '#FF0000', FALSE, TRUE ),
    ('ENC',  'Encombrants / Mobilier',              '#A9A9A9', FALSE, FALSE),
    ('DIV',  'Déchets divers non classifiés',       '#D3D3D3', FALSE, FALSE);

-- Zones initiales (Conakry)
INSERT INTO zones (nom, commune, prefecture, region) VALUES
    ('Kaloum Centre',    'Kaloum',    'Conakry', 'Conakry'),
    ('Dixinn Nord',      'Dixinn',    'Conakry', 'Conakry'),
    ('Ratoma Est',       'Ratoma',    'Conakry', 'Conakry'),
    ('Matoto Ouest',     'Matoto',    'Conakry', 'Conakry'),
    ('Matam Centre',     'Matam',     'Conakry', 'Conakry');

-- =============================================================================
-- COMMENTAIRES SUR LES TABLES
-- =============================================================================
COMMENT ON TABLE roles               IS 'Rôles et permissions des utilisateurs';
COMMENT ON TABLE utilisateurs        IS 'Comptes utilisateurs du système GN_Déchet';
COMMENT ON TABLE zones               IS 'Zones géographiques de collecte des déchets';
COMMENT ON TABLE agents_collecte     IS 'Agents terrain responsables des tournées de collecte';
COMMENT ON TABLE menages             IS 'Foyers abonnés au service de collecte';
COMMENT ON TABLE types_dechets       IS 'Catégories et types de déchets collectés';
COMMENT ON TABLE collectes           IS 'Opérations de collecte de déchets effectuées';
COMMENT ON TABLE collecte_types_dechets IS 'Association entre collectes et types de déchets';
COMMENT ON TABLE paiements           IS 'Paiements des abonnements et services de collecte';
COMMENT ON TABLE reclamations        IS 'Réclamations et signalements des ménages';
COMMENT ON TABLE notifications       IS 'Notifications envoyées aux utilisateurs';
COMMENT ON TABLE tournees            IS 'Planification et suivi des tournées de collecte';
COMMENT ON TABLE audit_log           IS 'Journal d''audit pour traçabilité des actions sensibles';

-- =============================================================================
-- FIN DU SCHÉMA
-- =============================================================================
