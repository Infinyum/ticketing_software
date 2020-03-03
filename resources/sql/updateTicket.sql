UPDATE ticket t
INNER JOIN site s ON s.id = t.id_site
INNER JOIN demandeur d ON d.email = t.demandeur
INNER JOIN client c ON d.id_client = c.id
INNER JOIN categorie_ticket c_t ON c_t.id_ticket = t.id
LEFT JOIN (SELECT u.nom as technician_name, u.id as technician_id, t_t.date_intervention as intervention_datetime, t_t.id_ticket as id_ticket FROM ticket_technicien t_t INNER JOIN utilisateur u ON u.id = t_t.id_technicien) sub ON sub.id_ticket = t.id
SET t.titre = ?, t.poids = ?, s.adresse = ?, s.latitude = ?, s.longitude = ?, d.email = ?, d.nom = ?, c_t.categorie = ?, t.statut = ?, t.call_date = ?, t.description = ?, t.type = ?, c.nom = ?, t.duree_previsible = ?, t.duree_effective = ?, sub.intervention_datetime = ?, sub.technician_name = ?
WHERE t.id = ?;