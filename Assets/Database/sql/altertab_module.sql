/**
 * Script MySQL pour Module
 * 
**/

ALTER TABLE sc_module ADD COLUMN	`id` int NOT NULL AUTO_INCREMENT COMMENT 'Identifiant';
ALTER TABLE sc_module ADD COLUMN	`name` varchar(255) NOT NULL COMMENT 'Nom';
ALTER TABLE sc_module ADD COLUMN	`visual` varchar(4000) COMMENT 'Visuel';
ALTER TABLE sc_module ADD COLUMN	`order` int NOT NULL COMMENT 'Ordre';
ALTER TABLE sc_module ADD COLUMN	`session_id` int NOT NULL COMMENT 'Séance';


ALTER TABLE sc_module ADD CONSTRAINT FK_sc_module_session_id_sc_session_id FOREIGN KEY (`session_id`) REFERENCES sc_session (`id`);


