SELECT t.id as id, t.parent as id_parent, t.titre as object, t.poids as poids, s.adresse as address, s.latitude as latitude, s.longitude as longitude, d.email as asker_email, d.nom as asker_name, c_t.categorie as category, t.statut as status, t.creation_date as creation_date, t.call_date as call_date, t.description as description, t.type as type, c.nom as client, c.prioritaire as priority, duree_previsible as planned_duration, duree_effective as actual_duration, temp.intervention_datetime as intervention_datetime, temp.technician_name as technician_name, temp.technician_id as technician_id
FROM ticket t
INNER JOIN site s ON t.id_site = s.id
INNER JOIN demandeur d ON d.email = t.demandeur
INNER JOIN client c ON d.id_client = c.id
INNER JOIN categorie_ticket c_t ON c_t.id_ticket = t.id
LEFT JOIN (SELECT u.nom as technician_name, u.id as technician_id, t_t.date_intervention as intervention_datetime, t_t.id_ticket as id_ticket FROM ticket_technicien t_t INNER JOIN utilisateur u ON u.id = t_t.id_technicien) temp ON temp.id_ticket = t.id;