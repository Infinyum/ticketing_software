//We use JavaScript's stict mode to ensure a high JavaScript code quality
"use strict";

//Operator exclusive code


$(window).on('load',function(){
	
	document.getElementById("TechnicPeopleList").disabled = true;
	document.getElementById("PrevisibleTimeInput").disabled = true;
	document.getElementById("EffectiveTimeInput").disabled = true;
	
	
	// For the client overlay
	
	/**
	 * Anonymous Function that opens the creation/modif interface
	 * this function is called when the user click on the 'modifier' or 'créer un nouveau ticket' button
	 * @param : nothing
	 * @return : nothing
	*/
	$(document).on('click','#addClient-btn',function(){
	
		showOverlayClient();
	
	});
	
	function showOverlayClient(){
	
	document.getElementById("myNavClient").style.width = "100%";
	document.getElementById("myNavClient").style.height = "100%";
	}

    /**
	 * Anonymous Function that cancel the deep dive modifications in the entries
	 * this function is called when the user click on the x (cross) button
	 * @param : nothing
	 * @return : nothing
	*/
	$('.closeOverlayClient-btn').click(function(){
		
		document.getElementById("myNavClient").style.height = "0%";
		
	});
	
	
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
	
	function showOverlayDemandeur(){
	
	document.getElementById("myNavDemandeur").style.width = "100%";
	document.getElementById("myNavDemandeur").style.height = "100%";
	}

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
	 * Anonymous Function that change the Client name on the new Demandeur Overlay
	 * this function is called when the user click on list of client
	 * @param : nothing
	 * @return : nothing
	*/
	$(document).on('click','#modification',function(){
		
		
		document.getElementById("ClientSelect").disabled = true;
		document.getElementById("TicketType").disabled = true;
		document.getElementById("CategorieSelect").disabled = true;
		document.getElementById("addClient-btn").disabled = true;
		document.getElementById("AskerSelect").disabled = true;
		document.getElementById("addDemandeur-btn").disabled = true;
		document.getElementById("ObjectText").disabled = true;
		document.getElementById("DateInput").disabled = true;
		document.getElementById("InterventionPlace").disabled = true;
		
		/**
		 * Anonymous Function that change the Client name on the new Demandeur Overlay
		 * this function is called when the user click on list of client
		 * @param : nothing
		 * @return : nothing
		*/
		$('.closeOverlay-btn').click(function(){
			document.getElementById("ClientSelect").disabled = false;
			document.getElementById("TicketType").disabled = false;
			document.getElementById("CategorieSelect").disabled = false;
			document.getElementById("addClient-btn").disabled = false;
			document.getElementById("AskerSelect").disabled = false;
			document.getElementById("addDemandeur-btn").disabled = false;
			document.getElementById("ObjectText").disabled = false;
			document.getElementById("DateInput").disabled = false;
			document.getElementById("InterventionPlace").disabled = false;
			
		});
	});
	
});