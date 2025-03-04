/**
 * Script MySQL pour User
 * 
**/

ALTER TABLE sc_user ADD COLUMN	`id` int NOT NULL AUTO_INCREMENT COMMENT 'Identifiant';
ALTER TABLE sc_user ADD COLUMN	`name` varchar(255) NOT NULL COMMENT 'Nom';
ALTER TABLE sc_user ADD COLUMN	`login` varchar(255) NOT NULL COMMENT 'Login';
ALTER TABLE sc_user ADD COLUMN	`password` varchar(255) NOT NULL COMMENT 'Mot de passe';
ALTER TABLE sc_user ADD COLUMN	`token` varchar(4000) COMMENT 'Token';




