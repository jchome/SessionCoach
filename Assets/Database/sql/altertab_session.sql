/**
 * Script MySQL pour Session
 * 
**/

ALTER TABLE sc_session ADD COLUMN	`id` int NOT NULL AUTO_INCREMENT COMMENT 'Identifiant';
ALTER TABLE sc_session ADD COLUMN	`name` varchar(255) NOT NULL COMMENT 'Nom';
ALTER TABLE sc_session ADD COLUMN	`visual` varchar(4000) COMMENT 'Visuel';




