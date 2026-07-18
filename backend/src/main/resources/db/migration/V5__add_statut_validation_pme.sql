ALTER TABLE utilisateurs
ADD COLUMN statut_validation_pme VARCHAR(20) DEFAULT 'VALIDE';

-- Mettre à jour les utilisateurs existants pour éviter qu'ils ne soient bloqués
UPDATE utilisateurs SET statut_validation_pme = 'VALIDE' WHERE statut_validation_pme IS NULL;
