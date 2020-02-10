//We use JavaScript's stict mode to ensure a high JavaScript code quality
"use strict";

//Operator exclusive code

/*window.onload = function(){

	document.getElementById("TechnicPeopleList").disabled = true;
	document.getElementById("PrevisibleTimeInput").disabled = true;
	document.getElementById("EffectiveTimeInput").disabled = true;

}*/



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
	
});