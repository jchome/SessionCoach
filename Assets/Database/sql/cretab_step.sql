/**
 * Script MySQL pour Step
 * Depend de :
	- cretab_module.sql
**/

CREATE TABLE `sc_step` (
	`id` int NOT NULL AUTO_INCREMENT COMMENT 'Identifiant', 
	`name` varchar(255) NOT NULL COMMENT 'Nom', 
	`duration` varchar(255) NOT NULL COMMENT 'Durée', 
	`visual` varchar(4000) COMMENT 'Visuel', 
	`description` text(4000) COMMENT 'Description', 
	`order` int NOT NULL COMMENT 'Ordre', 
	`module_id` int NOT NULL COMMENT 'Module' ,
	PRIMARY KEY (id) 
);


ALTER TABLE sc_step ADD CONSTRAINT FK_sc_step_module_id_sc_module_id FOREIGN KEY (`module_id`) REFERENCES sc_module (`id`);


