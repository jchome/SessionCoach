/**
 * Script MySQL pour Step
 * 
**/

ALTER TABLE sc_step ADD COLUMN	`id` int NOT NULL AUTO_INCREMENT COMMENT 'Identifiant';
ALTER TABLE sc_step ADD COLUMN	`name` varchar(255) NOT NULL COMMENT 'Nom';
ALTER TABLE sc_step ADD COLUMN	`duration` varchar(255) NOT NULL COMMENT 'Durée';
ALTER TABLE sc_step ADD COLUMN	`visual` varchar(4000) COMMENT 'Visuel';
ALTER TABLE sc_step ADD COLUMN	`description` text(4000) COMMENT 'Description';
ALTER TABLE sc_step ADD COLUMN	`order` int NOT NULL COMMENT 'Ordre';
ALTER TABLE sc_step ADD COLUMN	`module_id` int NOT NULL COMMENT 'Module';


ALTER TABLE sc_step ADD CONSTRAINT FK_sc_step_module_id_sc_module_id FOREIGN KEY (`module_id`) REFERENCES sc_module (`id`);


