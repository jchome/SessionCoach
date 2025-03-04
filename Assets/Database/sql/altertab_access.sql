/**
 * Script MySQL pour Access
 * 
**/

ALTER TABLE sc_access ADD COLUMN	`id` int NOT NULL AUTO_INCREMENT COMMENT 'Identifiant';
ALTER TABLE sc_access ADD COLUMN	`user_id` int NOT NULL COMMENT 'Utilisateur';
ALTER TABLE sc_access ADD COLUMN	`session_id` int NOT NULL COMMENT 'Séance';


ALTER TABLE sc_access ADD CONSTRAINT FK_sc_access_user_id_sc_user_id FOREIGN KEY (`user_id`) REFERENCES sc_user (`id`);
ALTER TABLE sc_access ADD CONSTRAINT FK_sc_access_session_id_sc_session_id FOREIGN KEY (`session_id`) REFERENCES sc_session (`id`);


