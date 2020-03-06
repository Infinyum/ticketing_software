//We use JavaScript's stict mode to ensure a high JavaScript code quality
"use strict";

//Operator exclusive code
var map;


var mapBrouillon = [];
var mapAffectation = [];
var mapEnAttente = [];
var mapIntervention = [];
var mapEnCours = [];
var mapFerme = [];
var mapAnnule = [];

var layerBrouillon;
var layerAffectation;
var layerEnAttente;
var layerIntervention;
var layerEnCours;
var layerFerme;
var layerAnnule;

var iconBrouillon = L.icon({
    iconUrl: '../Deps/Common/img/map_icons/map-marker-brouillon.png',
    iconSize: [30, 32],
    popupAnchor: [0, -10]
});

var iconAffectation = L.icon({
    iconUrl: '../Deps/Common/img/map_icons/map-marker-affect.png',
    iconSize: [30, 32],
    popupAnchor: [0, -10]
});

var iconEnAttente = L.icon({
    iconUrl: '../Deps/Common/img/map_icons/map-marker-attente.png',
    iconSize: [30, 32],
    popupAnchor: [0, -10]
});

var iconIntervention = L.icon({
    iconUrl: '../Deps/Common/img/map_icons/map-marker-intervention.png',
    iconSize: [30, 32],
    popupAnchor: [0, -10]
});

var iconEnCours = L.icon({
    iconUrl: '../Deps/Common/img/map_icons/map-marker-enCours.png',
    iconSize: [30, 32],
    popupAnchor: [0, -10]
});

var iconFerme = L.icon({
    iconUrl: '../Deps/Common/img/map_icons/map-marker-ferme.png',
    iconSize: [30, 32],
    popupAnchor: [0, -10]
});

var iconAnnule = L.icon({
    iconUrl: '../Deps/Common/img/map_icons/map-marker-annule.png',
    iconSize: [30, 32],
    popupAnchor: [0, -10]
});

$(window).on('load',function(){

	/*
	var ticketMapTest = {};
	ticketMapTest["ORAN-12345-1"] = {"status":"Brouillon","id":"ORAN-12345-1","date":"2020-01-22","address":"19 rue de liers, saint michel sur orge"};
	ticketMapTest["ORAN-12345-2"] = {"status":"En attente","id":"ORAN-12345-2","date":"2020-01-22","address":"10 rue auber, Paris"};
	ticketMapTest["ORAN-12345-3"] = {"status":"Requiert affectation","id":"ORAN-12345-3","date":"2020-01-22","address":"Brest"};
	*/
		
	// center the map on France
	var lat = 46.528634;
	var long = 2.438964;
	// initialize map
	map = L.map('mapDisplay').setView([lat, long], 6);
	// set map tiles source
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
	  maxZoom: 18,
	}).addTo(map);	
	
	$(document).on('click','#BrouillonCheckBox',function(){
		if(document.getElementById("BrouillonCheckBox").checked){
			layerBrouillon.addTo(map);
		}else{
			layerBrouillon.remove();
		}

	});
	
		$(document).on('click','#RequiertAffectationCheckBox',function(){
		if(document.getElementById("RequiertAffectationCheckBox").checked){
			layerAffectation.addTo(map);
		}else{
			layerAffectation.remove();
		}

	});
	
		$(document).on('click','#EnAttenteCheckBox',function(){
		if(document.getElementById("EnAttenteCheckBox").checked){
			layerEnAttente.addTo(map);
		}else{
			layerEnAttente.remove();
		}

	});
	
		$(document).on('click','#InterventionPlanifieeCheckBox',function(){
		if(document.getElementById("InterventionPlanifieeCheckBox").checked){
			layerIntervention.addTo(map);
		}else{
			layerIntervention.remove();
		}

	});
	
		$(document).on('click','#EnCours',function(){
		if(document.getElementById("EnCours").checked){
			layerEnCours.addTo(map);
		}else{
			layerEnCours.remove();
		}

	});
	
		$(document).on('click','#FermeCheckBox',function(){
		if(document.getElementById("FermeCheckBox").checked){
			layerFerme.addTo(map);
		}else{
			layerFerme.remove();
		}

	});
	
		$(document).on('click','#AnnuleCheckBox',function(){
		if(document.getElementById("AnnuleCheckBox").checked){
			layerAnnule.addTo(map);
		}else{
			layerAnnule.remove();
		}

	});
	

});

function findLatLong(address){
	var adressLat;
	var adressLong;
	$.ajax({
	    type: "GET",
	    url: "https://api-adresse.data.gouv.fr/search/?q="+address,
	    dataType:"JSON",
	    async: false,
	    success : function(reponse, statut){
	    	adressLong = reponse["features"][0]["geometry"]["coordinates"][0];
	    	adressLat = reponse["features"][0]["geometry"]["coordinates"][1];
       },

       error : function(reponse, statut, erreur){
			console.log("ERROR!" + statut + "\n" + erreur);
       }
    });
    return [adressLat,adressLong];
}

function addMarker(ticket){
	var adressGPS = findLatLong(ticket["address"]);
	var markerLat = adressGPS[0];
	var markerLong = adressGPS[1];
	
	
	// add marker to the map
	var marker = L.marker([markerLat, markerLong]);

	switch(ticket["status"]){
		case "Brouillon" : 
			marker.setIcon(iconBrouillon);
			mapBrouillon.push(marker);
			break;
		case "Requiert affectation" : 
			marker.setIcon(iconAffectation);
			mapAffectation.push(marker);
			break;
		case "En attente" : 
			marker.setIcon(iconEnAttente);
			mapEnAttente.push(marker);
			break;
		case "Intervention planifiée" : 
			marker.setIcon(iconIntervention);
			mapIntervention.push(marker);
			break;
		case "En cours" : 
			marker.setIcon(iconEnCours);
			mapEnCours.push(marker);	
			break;
		case "Fermé" : 
			marker.setIcon(iconFerme);
			mapFerme.push(marker);
			break;
		case "Annulé" : 
			marker.setIcon(iconAnnule);
			mapAnnule.push(marker);
			break;
		default :
			
	}
	
	// add popup to the marker
	marker.bindPopup("<b>"+ticket["id"]+"</b><br>"+ ticket["status"] + "<br>" + ticket["address"]);
}

function loadMap(){
	layerBrouillon = L.layerGroup(mapBrouillon).addTo(map);
	layerAffectation = L.layerGroup(mapAffectation).addTo(map);
	layerEnAttente = L.layerGroup(mapEnAttente).addTo(map);
	layerIntervention = L.layerGroup(mapIntervention).addTo(map);
	layerEnCours = L.layerGroup(mapEnCours).addTo(map);
	layerFerme = L.layerGroup(mapFerme).addTo(map);
	layerAnnule = L.layerGroup(mapAnnule).addTo(map);
}




