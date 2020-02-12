//We use JavaScript's stict mode to ensure a high JavaScript code quality
"use strict";

//Technician exclusive code


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
	}else if(startButton.value == "Demarrer"){
		start = new Date()
		startButton.value = "Arret"
		chrono('chronotime_'+ticketId)
	}else if(startButton.value == "Reprendre"){
		startButton.value = "Arret"
				start = new Date()-diff
		start = new Date(start)
		chrono('chronotime_'+ticketId)
	}
});

$(document).on('click','.resetButton',function(){
	var strSplit = this.id.split('_')
	var ticketId = strSplit[1]
	document.getElementById('btnStartStop_'+ticketId).value = "Demarrer"
	document.getElementById('chronotime_'+ticketId).innerHTML = "0:00:00:00"
	start = new Date()
	clearTimeout(timerID)
});
	

/*****************						Row table						****************/

$(document).on('click','#InterventionView-btn',function(){
	
	//hide all views
	$('.views').css('display','none');
	
	// we retrieve all the name of the view according to the button name
	// /!\ Button id and the view id should only differ by the 4 ending char
	// for example : myView1 works with myView1-btn, etc.
	var id = this.id.substr(0, this.id.length-4);

	//We get the div to display according to the button we press on (ID should match in both scenarion, we just -btn to the button)
	document.getElementById(id).style.display="block";
	
	$.ajax({
		type: "POST",
		url: host+"/getmytechtickets",
		dataType:"JSON",	//what we send
		contentType:"application/json", //what we expect as the response
		data:JSON.stringify({id:21505228}),
		beforeSend:function(xhr){
			// disabling all search buttons to not overload the server while the query is happening
			$('.search-get').attr("disabled", true);
		},
		complete:function(xhr){
			// enabling back all search buttons after query finished (whether in failure or success)
			$('.search-get').attr("disabled", false);
		},
		success:function(element){
			//Process success of the request...			
			for(int i=0; i < sizeof(ticket); i++){
				addRow(EtatTicket, IdTicket, DateTicket, EntrepriseClient)
			}
		}
	});
		
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
	
	let table = document.getElementById('ticket-table-intervention');
	let tbody = document.createElement('tbody');

	let row = tbody.insertRow(0);
	//Fill the row
	row.insertCell(0).innerHTML = "<td><button class=\"modify-btn\">Modifier</button></td>"; //Insert the "modifier" button
	row.insertCell(1).innerHTML = '<span style="color:darkblue;">'+ etatTicket+'</span>';
	row.insertCell(2).innerHTML = idTicket;
	row.insertCell(3).innerHTML = dateTicket;
	row.insertCell(4).innerHTML = entreprise;
	row.insertCell(5).innerHTML = '<span id="chronotime_'+idTicket+'">0:00:00:00</span>';
	row.insertCell(6).innerHTML = '<form name="chronoForm"><input id="btnStartStop_'+ idTicket +'" type="button" class="timerButton startButton" name="startstop" value="Demarrer" /><br><input id="btnReset_'+idTicket+'" type="button" class="timerButton resetButton" name="reset" value="Reset" /><br><input id="btnValide_'+idTicket+'" type="button" class="timerButton valideButton" name="valide" value="Valider" /></form>';
	
	//We append the new tbody to the table
	table.appendChild(tbody);
	// document.getElementById("ticket-table").innerHTML +='<tbody><tr class="parent"><td><button class="modify-btn" id="' + idTicket +'" >Modifier</button></td><td><span style="color:darkblue;">'+ etatTicket+'</span></td><td>'+ idTicket +'</td><td>'+ dateTicket +'</td><td>'+entreprise+'</td><td><span id="chronotime_'+idTicket+'">0:00:00:00</span></td><td><form name="chronoForm"><input id="btnStartStop_'+ idTicket +'" type="button" class="timerButton startButton" name="startstop" value="Demarrer" /><br><input id="btnReset_'+idTicket+'" type="button" class="timerButton resetButton" name="reset" value="Reset" /></form></td></tr></tbody>'
	
}	

$(function() { /* code here */ 
	addRowIntervention("En Attente", 12354664, "15 mars 2019", "Jean Boucherie")
	addRowIntervention("En Cours", 45624858, "20 frevrier 2020", "Joe Boucherie")

});


$(document).on('click','.valideButton',function(){
	var strSplit = this.id.split('_')
	var ticketId = strSplit[1]
	document.getElementById('btnStartStop_'+ticketId).value = "Demarrer"
	clearTimeout(timerID)
});




