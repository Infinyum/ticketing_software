//We use JavaScript's stict mode to ensure a high JavaScript code quality
"use strict";

//Technician exclusive code

var statutChange = 0;

$(function() { /* code here */ 
	var technicienConnect = document.getElementById("user");
	technicienConnect.innerHTML = sessionStorage.getItem("username")+ '<br/>(Technicien)<br><a href="">Deconnexion</a>';

	
	var technicienSelect = document.getElementById("TechnicPeopleList");
	if(technicienSelect.options.length == 0){
		technicienSelect.options[technicienSelect.options.length] = new Option(' ', '0', false, false);
		technicienSelect.options[technicienSelect.options.length] = new Option(sessionStorage.getItem("username"), sessionStorage.getItem("userID"),false,false);
		// TODO : requete pour recuperer le technicien actuel
		//sessionStorage.setItem("username", response.nom);
		//sessionStorage.setItem("userID", response.id);
	}
});

/*****************		View Set Ticket	from view "Intervention"		****************/

$(document).on('click','.modify-btn-intervention',function(){
	showOverlay();
	document.getElementById("StatusSelectModifTick").disabled = true;
	document.getElementById("TicketType").disabled = true;
	document.getElementById("CategorieSelect").disabled = true;
	document.getElementById("ClientSelect").disabled = true;
	document.getElementById("PriorityCheckBox").disabled = true;
	document.getElementById("AskerSelect").disabled = true;
	document.getElementById("ObjectText").disabled = true;
	// optionnel, on laisse la possibilite de le changer/ ajouter des remarques
	//document.getElementById("DescText").disabled = true;
	document.getElementById("DateInput").disabled = true;
	document.getElementById("skills").disabled = true;	
	document.getElementById("InterventionPlace").disabled = true;	
	document.getElementById("InterventionDateInput").disabled = true;
	document.getElementById("TechnicPeopleList").disabled = true;

});

/*****************						View New Ticket					****************/

$(document).on('click','.modify-btn',function(){
	
	document.getElementById("StatusSelectModifTick").disabled = true;
	document.getElementById("TicketType").disabled = true;
	document.getElementById("CategorieSelect").disabled = true;
	document.getElementById("ClientSelect").disabled = true;
	document.getElementById("PriorityCheckBox").disabled = true;
	document.getElementById("AskerSelect").disabled = true;
	document.getElementById("ObjectText").disabled = true;
	// optionnel, on laisse la possibilite de le changer/ ajouter des remarques
	//document.getElementById("DescText").disabled = true;
	document.getElementById("DateInput").disabled = true;
	document.getElementById("skills").disabled = true;	
	document.getElementById("InterventionPlace").disabled = true;	
	document.getElementById("InterventionDateInput").disabled = true;
	document.getElementById("InterventionTimeInput").disabled = true;
	document.getElementById("TechnicPeopleList").disabled = false;

});
	
/*****************			View Set Ticket	from view "vue ticket"		****************/

$(document).on('click','#ticketCreation-btn',function(){
	
	document.getElementById("StatusSelectModifTick").disabled = true;
	document.getElementById("TicketType").disabled = false;
	document.getElementById("CategorieSelect").disabled = false;
	document.getElementById("ClientSelect").disabled = false;
	document.getElementById("PriorityCheckBox").disabled = false;
	document.getElementById("AskerSelect").disabled = false;
	document.getElementById("ObjectText").disabled = false;
	// optionnel, on laisse la possibilite de le changer/ ajouter des remarques
	//document.getElementById("DescText").disabled = true;
	document.getElementById("DateInput").disabled = false;
	document.getElementById("skills").disabled = false;	
	document.getElementById("InterventionPlace").disabled = false;	
	document.getElementById("InterventionDateInput").disabled = false;
	document.getElementById("InterventionTimeInput").disabled = false;
	document.getElementById("TechnicPeopleList").disabled = false;
	
});

/*****************						Timer						****************/

var startTime = 0
var start = 0
var end = 0
var diff = 0
var timerID = 0
function chrono(id){
	end = new Date()
	diff = end - start
	diff = new Date(diff)
	var msec = diff.getMilliseconds()
	var sec = diff.getSeconds()
	var min = diff.getMinutes()
	var hr = diff.getHours()-1
	if (min < 10){
		min = "0" + min
	}
	if (sec < 10){
		sec = "0" + sec
	}
	if(msec < 10){
		msec = "00" +msec
	}
	else if(msec < 100){
		msec = "0" +msec
	}
	document.getElementById(id).innerHTML = hr + ":" + min + ":" + sec + ":" + msec
	var id_tmp = id
	timerID = setTimeout("chrono(\""+id+"\")", 10)
}

$(document).on('click','.startButton',function(){
	//window.alert(document.getElementById(this.id).value);
	var strSplit = this.id.split('_')
	var ticketId = strSplit[1]
	var chronometre = document.getElementById('chronotime_'+ticketId)
	var startButton = document.getElementById(this.id)
	if(startButton.value == "Arret"){
		startButton.value = "Reprendre"
		clearTimeout(timerID)
		document.getElementById('btnValide_'+ticketId).disabled = ""
	}else if(startButton.value == "Demarrer"){
		start = new Date()
		startButton.value = "Arret"
		chrono('chronotime_'+ticketId)
		document.getElementById('btnValide_'+ticketId).disabled = "disabled"
		var btnsTimer = document.getElementsByClassName('setButton')
		Array.from(btnsTimer).forEach((btnTimer) => {
			// Do stuff here
			btnTimer.disabled = "disabled"
		});
		document.getElementById('btnStartStop_'+ticketId).disabled = ""
		document.getElementById('btnReset_'+ticketId).disabled = ""
		document.getElementById('StatutSelectIntervention_'+ticketId).disabled = ""
		
	}else if(startButton.value == "Reprendre"){
		startButton.value = "Arret"
		start = new Date()-diff
		start = new Date(start)
		chrono('chronotime_'+ticketId)
		document.getElementById('btnValide_'+ticketId).disabled = "disabled"
		
	}
	
	
});


$(document).on('click','.resetButton',function(){
	var strSplit = this.id.split('_')
	var ticketId = strSplit[1]
	document.getElementById('btnStartStop_'+ticketId).value = "Demarrer"
	document.getElementById('chronotime_'+ticketId).innerHTML = "0:00:00:00"
	start = new Date()
	clearTimeout(timerID)
	if(statutChange == 0){
		document.getElementById('btnValide_'+ticketId).disabled = "disabled"
	}else if(statutChange == 1){
		document.getElementById('btnValide_'+ticketId).disabled = ""
	}
	var btnsTimer = document.getElementsByClassName('setButton')
	Array.from(btnsTimer).forEach((btnTimer) => {
		// Do stuff here
		btnTimer.disabled = ""
		
	});
	document.getElementById('btnStartStop_'+ticketId).disabled = ""
	document.getElementById('btnReset_'+ticketId).disabled = ""
	document.getElementById('StatutSelectIntervention_'+ticketId).disabled = ""
});
	

/*****************					Row table						****************/

$.ajax({
	type: "POST",
	url: host+"/getmytechtickets",
	dataType:"JSON",	//what we send
	contentType:"application/json", //what we expect as the response
	data:JSON.stringify({id:sessionStorage.getItem("userID")}),
	beforeSend:function(){
		// disabling all search buttons to not overload the server while the query is happening
		
	},
	complete:function(){
		// enabling back all search buttons after query finished (whether in failure or success)
	},
	success:function(response){
		//alert("test3");
		//console.log(response)
		//Process success of the request...
		for (let i = 0; i < response.length; i++) {

			let ticket = response[i];
			let idTicket = ticket["id"];
			let statut = ticket["statut"];
			let companyName = ticket["entreprise"];
			let callDate = new Date(ticket["call_date"]).toISOString().substring(0,10);
			//alert(statut);
			if(statut == "Intervention planifiée" || statut == "En cours" ||statut == "Fermé")
				addRowIntervention(statut, idTicket, callDate, companyName);
		}
	}
});

$(document).on('click','#InterventionView-btn',function(){
	
	//hide all views
	$('.views').css('display','none');

	// we retrieve all the name of the view according to the button name
	// /!\ Button id and the view id should only differ by the 4 ending char
	// for example : myView1 works with myView1-btn, etc.
	var id = this.id.substr(0, this.id.length-4);

	//We get the div to display according to the button we press on (ID should match in both scenarion, we just -btn to the button)
	document.getElementById(id).style.display="block";

	
	
	
	// TODO: request to get tickets form database
	/*
	for(int i=0; i < sizeof(ticket); i++){
		addRow(EtatTicket, IdTicket, DateTicket, EntrepriseClient)
	}
	*/
	//addRowIntervention("En Attente", 12354664, "15 mars 2019", "Jean Boucherie")
	//addRowIntervention("En Cours", 45624858, "20 frevrier 2020", "Joe Boucherie")
});

function addRowIntervention(etatTicket, idTicket, dateTicket, entreprise){
	//alert(etatTicket)
	//alert(etatTicket == "Intervention planifiée")
	let table = document.getElementById('ticket-table-intervention');
	let tbody = document.createElement('tbody');
	tbody.id = idTicket;
	
	let row = tbody.insertRow(0);
	row.class="ligneIntervention"
	row.id="ligneIntervention_"+idTicket
	
	//Fill the row
	row.insertCell(0).innerHTML = "<button class=\"modify-btn\">Modifier</button>"; //Insert the "modifier" button
	/*
	row.insertCell(1).innerHTML = '<select class="formElement" id="StatutSelectIntervention_'+idTicket+'"><option value="InterventionPlanifiee" selected>Intervention Planifiée</option><option value="EnCours">En Cours</option><option value="Ferme">Fermé</option><option value="Annule">Annulé</option></select>'
	*/
	
	if(etatTicket == "Intervention planifiée"){
		row.insertCell(1).innerHTML = '<select class="formElementIntervention setButton" id="StatutSelectIntervention_'+idTicket+'"><option value="Intervention planifiée" selected>Intervention planifiée</option><option value="En cours">En Cours</option><option value="Fermé">Fermé</option><option value="Annulé">Annulé</option></select>';
	}else if(etatTicket == "En cours"){
		row.insertCell(1).innerHTML = '<select class="formElementIntervention setButton" id="StatutSelectIntervention_'+idTicket+'"><option value="Intervention planifiée">Intervention planifiée</option><option value="En cours" selected>En Cours</option><option value="Fermé">Fermé</option><option value="Annulé">Annulé</option></select>';
	}else if(etatTicket == "Fermé"){
		row.insertCell(1).innerHTML = '<select class="formElementIntervention setButton" id="StatutSelectIntervention_'+idTicket+'"><option value="Intervention planifiée">Intervention planifiée</option><option value="En cours">En Cours</option><option value="Fermé" selected>Fermé</option><option value="Annulé">Annulé</option></select>';
	}else if(etatTicket == "Annulé"){
		row.insertCell(1).innerHTML = '<select class="formElementIntervention setButton" id="StatutSelectIntervention_'+idTicket+'"><option value="Intervention planifiée">Intervention planifiée</option><option value="En cours">En cours</option><option value="Fermé">Fermé</option><option value="Annulé" selected>Annulé</option></select>';
	}else{
		row.insertCell(1).innerHTML = '<span> etatTicket </span>'
	}
	
	row.insertCell(2).innerHTML = idTicket;
	row.insertCell(3).innerHTML = dateTicket;
	row.insertCell(4).innerHTML = entreprise;
	row.insertCell(5).innerHTML = '<span id="chronotime_'+idTicket+'">0:00:00:00</span>';
	row.insertCell(6).innerHTML = '<form name="chronoForm"><input id="btnStartStop_'+ idTicket +'" type="button" class="timerButton startButton setButton" name="startstop" value="Demarrer" /><br><input id="btnReset_'+idTicket+'" type="button" class="timerButton resetButton setButton" name="reset" value="Reset" /></form>';
	row.insertCell(7).innerHTML = '<form name="ValideForm class="ValideForm" id="ValideForm_'+idTicket+'"><input id="btnValide_'+idTicket+'" type="button" class="valideButton setButton" name="valide" value="Enregistrer" disabled=disabled/></form>';
	
	//We append the new tbody to the table
	table.appendChild(tbody);
	// document.getElementById("ticket-table").innerHTML +='<tbody><tr class="parent"><td><button class="modify-btn" id="' + idTicket +'" >Modifier</button></td><td><span style="color:darkblue;">'+ etatTicket+'</span></td><td>'+ idTicket +'</td><td>'+ dateTicket +'</td><td>'+entreprise+'</td><td><span id="chronotime_'+idTicket+'">0:00:00:00</span></td><td><form name="chronoForm"><input id="btnStartStop_'+ idTicket +'" type="button" class="timerButton startButton" name="startstop" value="Demarrer" /><br><input id="btnReset_'+idTicket+'" type="button" class="timerButton resetButton" name="reset" value="Reset" /></form></td></tr></tbody>'
	
}

$(document).on('change','.formElementIntervention',function(){
	//alert("test");
	var strSplit = this.id.split('_')
	var ticketId = strSplit[1]
	document.getElementById('btnValide_'+ticketId).disabled = ""
	statutChange = 1
});

/*
$(function() {
	addRowIntervention("En Cours", 12354664, "2019-03-19", "Jean Boucherie")
	addRowIntervention("Intervention Planifiée", 45624858, "2020-02-14", "Joe Boucherie")
});
*/

$(document).on('click','.valideButton',function(){
	var strSplit = this.id.split('_')
	var ticketId = strSplit[1]
	document.getElementById('btnStartStop_'+ticketId).value = "Demarrer"
	document.getElementById('btnValide_'+ticketId).disabled = "disabled"
	clearTimeout(timerID)
	statutChange = 0
	var btnsTimer = document.getElementsByClassName('setButton')
	Array.from(btnsTimer).forEach((btnTimer) => {
		// Do stuff here
		btnTimer.disabled = ""
		
	});
	
	// ajouter requete sauvegarder valeur
	// envoi numero de ticket + numero technicien + statut ticket + temps intervention

	var statutSelect;
	
	statutSelect = document.getElementById('StatutSelectIntervention_'+ticketId).options[document.getElementById('StatutSelectIntervention_'+ticketId).selectedIndex].text;
	
	/*
	listeStatut = document.getElementById('StatutSelectIntervention_'+ticketId);
	valSelectStatut = listeStatut.options[listeStatut.selectedIndex].value;
	*/
	//var id = sessionStorage.getItem('userID');
	
	$.ajax({
	type: "POST",
	url: host+"/updatedureeticket",
	dataType:"json",	//what we send
	contentType:"application/json", //what we expect as the response
	data:JSON.stringify({id:ticketId,statut:statutSelect,duree:"02:15:25"}),
	beforeSend:function(){
		// disabling all search buttons to not overload the server while the query is happening
		//$('.search-get').attr("disabled", true);
		//alert("En cours d'enregistrement");
	},
	complete:function(){
		// enabling back all search buttons after query finished (whether in failure or success)
		//$('.search-get').attr("disabled", false);
		alert("Enregistrement termine");
	},success:function(){
		
		//Process success of the request...			
		//alert("Temps intervention et statut du ticket bien enregistre");
	}
	});
	
});







