//We use JavaScript's stict mode to ensure a high JavaScript code quality
"use strict";

//TechSupervisor exclusive code
window.addEventListener('load', function() {
    //this.document.getElementById("StatusSelectListHead").value = "Brouillon";
    //$('#StatusSelectListHead').trigger('input');
	
	
	
	$("#clientPriorityFilterBtn").on('input', function(){
	
		//Get all the filterable rows then put them in an Array
		let filterableRows = getTableStructure();
		let tableRows = Array.from(filterableRows);
		
		//hide filtered rows
		for (let i = 0; i < tableRows.length; i++) {

			//get all the row and its sub rows (in the tbody markup)
			let tbody1 = tableRows[i][1][1];
			//We get the main row (the ticket row)
			let row1 = tbody1.firstElementChild;
			//we get the correct cell we want to filter on
			let cellVal = row1.cells[6];

			if(this.checked){
				//if the row includes the filter : we keep it (remove display none if it was here)
				if (importantClientList.includes(cellVal.innerText)) {
					tbody1.style.display = "";
				} else {
					tbody1.style.display = "none";
				}
			}
			else{
				tbody1.style.display = "";
			}
		}
	});
	
	/*
    //Another listener to manage list of technician when modifying a ticket
    $(document).on('click', '.modify-btn', function () {            
		// Set techncian select
		$.ajax({
			type: "POST",
			url: host + "/gettechniciansfromcompetences",
			dataType: 'json',
			contentType: 'json', // Non present -> erreur serveur
			data: JSON.stringify({idResp:'21407234', competences:["frigoriste", "electricien"]}),
			success: (response, status, jqXHR) => {
				let techSelect = document.getElementById("TechnicPeopleList");
				let techId = (techSelect.value.includes('(') ? techSelect.value.substring(techSelect.value.indexOf('(')+1,techSelect.value.indexOf(')')) : "");
				// Clear select
				while(techSelect.length > 0)
					techSelect.remove(0);
				// Empty choice
				let opt = document.createElement('option');
				opt.value = "";
				opt.innerHTML = "";
				techSelect.appendChild(opt);
				// Fill select with new technicians
				let techIndex = -1;
				for(let i = 0; i < response.length; i++) {
					let tech = response[i];
					opt = document.createElement('option');
					opt.value = tech["id"];
					opt.innerHTML = tech["nom"];
					opt.selected = (techId == tech["id"].toString());
					techSelect.appendChild(opt);
				}
			},
			error: function (jqXHR, status, errorThrown) {
				console.log("ERROR!" + status + "\n" + errorThrown);
			}
		});
	});
	*/
});




