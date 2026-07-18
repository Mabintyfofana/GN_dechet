-- ============================================================
--  PLATEFORME DE PRÉ-COLLECTE DES DÉCHETS - GUINÉE
--  Script de création de la base de données PostgreSQL
--  Version : 1.0
--  Date    : 2026-07-04
-- ============================================================

-- Extension pour générer des UUID (recommandé pour les IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE 1 : UTILISATEURS
-- ============================================================
CREATE TABLE utilisateurs (
    id               UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom              VARCHAR(100)    NOT NULL,
    telephone        VARCHAR(20)     NOT NULL UNIQUE,
    mot_de_passe     VARCHAR(255)    NOT NULL,
    role             VARCHAR(20)     NOT NULL CHECK (role IN ('MENAGE', 'COLLECTEUR', 'ADMIN')),
    quartier         VARCHAR(100)    NOT NULL,
    point_de_repere  TEXT,
    actif            BOOLEAN         NOT NULL DEFAULT TRUE,
    date_creation    TIMESTAMP       NOT NULL DEFAULT NOW(),
    date_modification TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_utilisateurs_role      ON utilisateurs(role);
CREATE INDEX idx_utilisateurs_quartier  ON utilisateurs(quartier);
CREATE INDEX idx_utilisateurs_telephone ON utilisateurs(telephone);

-- ============================================================
-- TABLE 2 : ABONNEMENTS_MENAGES
-- ============================================================
CREATE TABLE abonnements_menages (
    id                      UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_menage               UUID            NOT NULL,
    date_paiement           DATE            NOT NULL DEFAULT CURRENT_DATE,
    date_expiration         DATE            NOT NULL,
    montant                 NUMERIC(10, 2)  NOT NULL CHECK (montant > 0),
    reference_mobile_money  VARCHAR(100)    NOT NULL UNIQUE,
    statut                  VARCHAR(20)     NOT NULL DEFAULT 'ACTIF'
                                CHECK (statut IN ('ACTIF', 'EXPIRE', 'SUSPENDU', 'EN_ATTENTE')),
    date_creation           TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_abonnement_menage
        FOREIGN KEY (id_menage)
        REFERENCES utilisateurs(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE UNIQUE INDEX idx_abonnement_menage_actif
    ON abonnements_menages(id_menage)
    WHERE statut = 'ACTIF';

CREATE INDEX idx_abonnements_menages_statut     ON abonnements_menages(statut);
CREATE INDEX idx_abonnements_menages_expiration ON abonnements_menages(date_expiration);

-- ============================================================
-- TABLE 3 : ABONNEMENTS_COLLECTEURS
-- ============================================================
CREATE TABLE abonnements_collecteurs (
    id               UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_collecteur    UUID            NOT NULL,
    date_inscription DATE            NOT NULL DEFAULT CURRENT_DATE,
    zone_attribuee   VARCHAR(150)    NOT NULL,
    statut           VARCHAR(30)     NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION'
                         CHECK (statut IN ('ACTIF', 'SUSPENDU', 'INACTIF', 'EN_ATTENTE_VALIDATION')),
    commentaire      TEXT,
    date_modification TIMESTAMP      NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_abonnement_collecteur
        FOREIGN KEY (id_collecteur)
        REFERENCES utilisateurs(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE UNIQUE INDEX idx_abonnement_collecteur_actif
    ON abonnements_collecteurs(id_collecteur)
    WHERE statut = 'ACTIF';

CREATE INDEX idx_abonnements_collecteurs_zone   ON abonnements_collecteurs(zone_attribuee);
CREATE INDEX idx_abonnements_collecteurs_statut ON abonnements_collecteurs(statut);

-- ============================================================
-- TABLE 4 : SUIVI_RAMASSAGES
-- ============================================================
CREATE TABLE suivi_ramassages (
    id               UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_menage        UUID            NOT NULL,
    id_collecteur    UUID,
    date_heure       TIMESTAMP       NOT NULL DEFAULT NOW(),
    statut           VARCHAR(20)     NOT NULL DEFAULT 'EN_ATTENTE'
                         CHECK (statut IN ('EN_ATTENTE', 'CONFIRME', 'EN_COURS', 'FAIT', 'ANNULE')),
    note_menage      SMALLINT        CHECK (note_menage BETWEEN 1 AND 5),
    commentaire      TEXT,
    date_modification TIMESTAMP      NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ramassage_menage
        FOREIGN KEY (id_menage)
        REFERENCES utilisateurs(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_ramassage_collecteur
        FOREIGN KEY (id_collecteur)
        REFERENCES utilisateurs(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE INDEX idx_ramassages_menage     ON suivi_ramassages(id_menage);
CREATE INDEX idx_ramassages_collecteur ON suivi_ramassages(id_collecteur);
CREATE INDEX idx_ramassages_statut     ON suivi_ramassages(statut);
CREATE INDEX idx_ramassages_date       ON suivi_ramassages(date_heure DESC);

-- ============================================================
-- TRIGGER : Mise à jour automatique de date_modification
-- ============================================================
CREATE OR REPLACE FUNCTION update_date_modification()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_utilisateurs_modif
    BEFORE UPDATE ON utilisateurs
    FOR EACH ROW EXECUTE FUNCTION update_date_modification();

CREATE TRIGGER trg_collecteurs_modif
    BEFORE UPDATE ON abonnements_collecteurs
    FOR EACH ROW EXECUTE FUNCTION update_date_modification();

CREATE TRIGGER trg_ramassages_modif
    BEFORE UPDATE ON suivi_ramassages
    FOR EACH ROW EXECUTE FUNCTION update_date_modification();

-- ============================================================
-- COMMENTAIRES
-- ============================================================
COMMENT ON TABLE utilisateurs            IS 'Table centrale : ménages, collecteurs et admins';
COMMENT ON TABLE abonnements_menages     IS 'Abonnements payants des ménages (Mobile Money)';
COMMENT ON TABLE abonnements_collecteurs IS 'Inscription et zones des collecteurs';
COMMENT ON TABLE suivi_ramassages        IS 'Journal de toutes les opérations de collecte';
