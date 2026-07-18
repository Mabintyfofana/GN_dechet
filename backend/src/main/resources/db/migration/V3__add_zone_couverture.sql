ALTER TABLE entreprise_pme ADD COLUMN zone_couverture VARCHAR(255);
UPDATE entreprise_pme SET zone_couverture = 'Kaloum, Dixinn, Matam' WHERE nom = 'Soguipaq';
UPDATE entreprise_pme SET zone_couverture = 'Ratoma, Matoto' WHERE nom = 'Conakry Clean';
