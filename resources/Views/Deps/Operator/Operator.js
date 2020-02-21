//We use JavaScript's stict mode to ensure a high JavaScript code quality
"use strict";

//Operator exclusive code


$(window).on('load',function(){
		
	
	// For the demandeur overlay
	
	/**
	 * Anonymous Function that opens the creation/modif interface
	 * this function is called when the user click on the 'modifier' or 'créer un nouveau ticket' button
	 * @param : nothing
	 * @return : nothing
	*/
	$(document).on('click','#addDemandeur-btn',function(){
	
		showOverlayDemandeur();
	
	});
	
    /**
	 * Anonymous Function that cancel the deep dive modifications in the entries
	 * this function is called when the user click on the x (cross) button
	 * @param : nothing
	 * @return : nothing
	*/
	$('.closeOverlayDemandeur-btn').click(function(){
		
		document.getElementById("myNavDemandeur").style.height = "0%";
		
	});
	
	    /**
	 * Anonymous Function that change the Client name on the new Demandeur Overlay
	 * this function is called when the user click on list of client
	 * @param : nothing
	 * @return : nothing
	*/
	$(document).on('click','#ClientSelect',function(){
		
		var e = document.getElementById("ClientSelect");
		var name = e.options[e.selectedIndex].text;
		document.getElementById("ID-Demandeur").textContent = name;
		
	});
	
	/**
	 * Anonymous Function that add new demandeur to dmandeur select box
	 * this function is called when the user click DemandeurValidation-btn
	 * @param : nothing
	 * @return : nothing
	*/
	$(document).on('click','#DemandeurValidation-btn',function(){
		
		var name = document.getElementById("NameDemandeur").value;
		var selDemandeur = document.getElementById("AskerSelect");
		var opt = document.createElement('option');
		opt.appendChild(document.createTextNode(name));
		opt.value = name;
		selDemandeur.appendChild(opt);
		
	});
	

	$(document).on('click','.modify-btn',function(){

		document.getElementById("ClientSelect").disabled = true;
		document.getElementById("TicketType").disabled = true;
		document.getElementById("CategorieSelect").disabled = true;
		document.getElementById("AskerSelect").disabled = true;
		document.getElementById("addDemandeur-btn").disabled = true;
		document.getElementById("ObjectText").disabled = true;
		document.getElementById("DateInput").disabled = true;
		document.getElementById("InterventionPlace").disabled = true;
		
		document.getElementById("TechnicPeopleList").disabled = true;
		document.getElementById("PrevisibleTimeInput").disabled = true;
		document.getElementById("EffectiveTimeInput").disabled = true;

	});
	
	
	
	$(document).on('click','#ticketCreation-btn',function(){

		document.getElementById("TechnicPeopleList").disabled = true;
		document.getElementById("EffectiveTimeInput").disabled = true;
		document.getElementById("PriorityCheckBox").disabled = true;

	});
	
	
	$('.closeOverlay-btn').click(function(){
		document.getElementById("ClientSelect").disabled = false;
		document.getElementById("TicketType").disabled = false;
		document.getElementById("CategorieSelect").disabled = false;
		document.getElementById("AskerSelect").disabled = false;
		document.getElementById("addDemandeur-btn").disabled = false;
		document.getElementById("ObjectText").disabled = false;
		document.getElementById("DateInput").disabled = false;
		document.getElementById("InterventionPlace").disabled = false;

	});
	
});


function showOverlayDemandeur(){
	
	document.getElementById("myNavDemandeur").style.width = "100%";
	document.getElementById("myNavDemandeur").style.height = "100%";
}



