//We use JavaScript's strict mode to ensure a high JavaScript code quality
"use strict";

//Grab the name of the host to use it 
var host = document.URL;

//Map with all the tickets (id as key, ticket object as value)
var ticketMap = {};

//in this map, we map a ticket-ID to the list of sub-ticket-ID
var graphMap = {};

//List of category available
var categoryList = new Array();

//List of skills
var skillList = new Array();

/**
 * Loading function of the application
 * Map all the events' callback to our functions
 * @param : nothing
 * @return : nothing
 */
window.onload = function () {

	//reset the filters' value
	document.getElementsByClassName('columnFilters').value = "";

	//disable forever the priority checkbox
	document.getElementById("PriorityCheckBox").disabled = true;


	/**
	 * Load all the categories & skills
	 */
	{
		$.ajax({
			type: "POST",
			url: host+"/getcategories",
			dataType:"JSON",    //what we send
			contentType:"application/json", //what we expect as the response
			data:JSON.stringify(),
			success:function(res){
				
				if(res == null){
					return;
				}
				
				res.forEach(function(element){			
					categoryList.push(element);
				});
				
				
			}
		});
		
		$.ajax({
			type: "POST",
			url: host+"/getcompetences",
			dataType:"JSON",    //what we send
			contentType:"application/json", //what we expect as the response
			data:JSON.stringify(),
			success:function(res){
				
				if(res == null){
					return;
				}
				
				res.forEach(function(element){			
					skillList.push(element);
				});
				
				//Add all the skills to the modify list
				skillList.forEach(function(element){			
					  let x = document.getElementById("skills");
					  var option = document.createElement("option");
					  option.text = element["nom"];
					  option.value = element["nom"];
					  x.add(option);
				});
				
			}
		});
		
		
		
		
	}

	/**
	 * Anonymous function that manage the opening of the main ticket row
	 * it basically toggles a class stating if the row is open or not (applying some CSS property then)
	 * @param : nothing
	 * @return : nothing
	 */
	$("#ticket-table").on('click', 'td', function () {

		// The row should open/close if we click on any cell except the first one (the "modifier" button)
		if (this.cellIndex != 0) {
			if (this.parentNode.cellIndex != 0) {
				$(this).closest('tbody').toggleClass('open');
			}
		}
	});

	/**
	 * Anonymous function that react to a click on the header of the table and sort the table descending
	 * @param : nothing
	 * @return : nothing
	 */
	$(".header-row").on('click', '.sortableHeader', function () {
		sortDescTable(this.parentNode.cellIndex);
	});

	/**
	 * Anonymous function that react to a char entered in one of the filter textbox
	 * It then calls the function that filter the table
	 * @param : nothing
	 * @return : nothing
	 */
	$(".header-row").on('keyup', '.columnFilters', function () {
		filterTable(this.parentNode.cellIndex, this.value);
	});

	/**
	 * Anonymous function that react to change in select before ticket list
	 * It then calls the function that filter the table
	 */
	$('.selectFilter').on('input', function() {
		filterTable(this.getAttribute('iscolumn'), this.value);
	});


	/**
	 * Anonymous Function that opens the creation/modif interface
	 * this function is called when the user click on the 'modifier' or 'créer un nouveau ticket' button
	 * @param : nothing
	 * @return : nothing
	 */
	$(document).on('click', '.modify-btn', function () {

		let ticket = ticketMap[this.closest('tbody').id];
		
		let ID 		= ticket["id"];
		let parentID= ticket["id_parent"];
		
		if(parentID==null){
			parentID = "/";
		}
		
		let status	= ticket["status"];
		let type	= ticket["type"];
		let category= ticket["category"];
		
		let companyName = ticket["client"];
		let CompanyPrio = ticket["priority"];
		
		let askerName = ticket["asker_name"];
		let askerEmail= ticket["asker_email"];
		
		let object 		= ticket["object"];
		let description = ticket["description"];
		
		let creationDate= new Date(ticket["creation_date"]).toISOString().substring(0,10);
		let callDate	= new Date(ticket["call_date"]).toISOString().substring(0,10);
		
		let requiredSkills = ticket["required_skills"];
		
		console.log(requiredSkills);
		
		let interventionAddress	= ticket["address"];
		let interventionDateTime= ticket["intervention_datetime"];
		let interventionDate = new Date(interventionDateTime).toISOString().substring(0,10);
		let interventionTime = new Date(interventionDateTime).toISOString().substring(11,16);

		let technicianName	= ticket["technician_name"];
		let technicianID	= ticket["technician_id"];
		
		let plannedDuration	= ticket["planned_duration"];
		let actualDuration	= ticket["actual_duration"];
		
		let comments = ticket["comments"];
		
		let weight	= ticket["weight"];
		
		//Load all the values
		//TODO !
		document.getElementById("ID-ticket").innerHTML 			= ID;
		document.getElementById("ParentTicket").innerHTML 		= parentID;
		document.getElementById("StatusSelectModifTick").value 	= status;
		document.getElementById("TicketType").value 			= type;
		document.getElementById("CategorieSelect").value 		= category;
		document.getElementById("ClientSelect").value	 		= companyName;
		document.getElementById("PriorityCheckBox").checked	 	= CompanyPrio;
		document.getElementById("AskerSelect").value	 		= askerName + "(" + askerEmail + ")";
		document.getElementById("ObjectText").innerHTML 		= object;
		document.getElementById("DescriptionText").value 		= description;
		document.getElementById("CreationDate").innerHTML		= creationDate;
		document.getElementById("DateInput").value				= callDate;
		
		//document.getElementById("skills").value 				= //TODO ;
		document.getElementById("InterventionPlace").value 		= interventionAddress;
		document.getElementById("InterventionDateInput").value 	= interventionDate;
		document.getElementById("InterventionTimeInput").value 	= interventionTime;
		document.getElementById("TechnicPeopleList").value		= technicianName + "(" + technicianID + ")";
		document.getElementById("PrevisibleTimeInput").value 	= plannedDuration;
		document.getElementById("EffectiveTimeInput").value 	= actualDuration;
		
		//reset the comment list
		resetComments();
		
		//adding all the comments
		for(let c in comments){
			addComment(c);
		}
		
		//We retrieve the table
		let subTicketTable = document.getElementById('subTicketTable');
		//We create a fragment where we are going to make all the changes
		let fragment = document.createDocumentFragment();
		
		let children = graphMap[ID];

		children.forEach(function(element){
			
			addSubTicketRow(subTicketTable,element);
			
		});
		
		subTicketTable.appendChild(fragment);
		
		showOverlay();

	});

	/**
	 * Anonymous Function that opens the creation/modif interface
	 * this function is called when the user click on the 'modifier' or 'créer un nouveau ticket' button
	 * @param : nothing
	 * @return : nothing
	 */
	$(document).on('click', '#ticketCreation-btn', function () {

		let today = new Date();
		let formatedDate = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + today.getDate();

		//reset all values
		document.getElementById("ID-ticket").innerHTML = "/";
		document.getElementById("ParentTicket").innerHTML = "/";
		document.getElementById("StatusSelect").value = "Brouillon";
		document.getElementById("TicketType").value = "Demande";
		document.getElementById("CategorieSelect").value = "";
		document.getElementById("ClientSelect").value = "";
		document.getElementById("AskerSelect").value = "";
		document.getElementById("ObjectText").innerHTML = "";
		document.getElementById("DescriptionText").value = "";
		document.getElementById("CreationDate").innerHTML = formatedDate;
		document.getElementById("DateInput").value = formatedDate;
		document.getElementById("skills").value = "";
		document.getElementById("InterventionPlace").value = "";
		document.getElementById("InterventionDateInput").value = "";
		document.getElementById("InterventionTimeInput").value = "";
		document.getElementById("TechnicPeopleList").value = "";
		document.getElementById("PrevisibleTimeInput").value = "";
		document.getElementById("EffectiveTimeInput").value = "";

		resetComments();

		//and then we show the overlay
		showOverlay();

	});

	/**
	 * Anonymous function that reacts to a click on the view buttons
	 * It basically hide all the views and then display the correct one based on the id of the button
	 * @param : nothing
	 * @return : nothing
	 */
	$(document).on('click', '.view-btn', function () {

		//hide all views
		$('.views').css('display', 'none');

		// we retrieve all the name of the view according to the button name
		// /!\ Button id and the view id should only differ by the 4 ending char
		// for example : myView1 works with myView1-btn, etc.
		var id = this.id.substr(0, this.id.length - 4);

		//We get the div to display according to the button we press on (ID should match in both scenarion, we just -btn to the button)
		document.getElementById(id).style.display = "block";
		map.invalidateSize();

	});

	/**
	 * Anonymous Function that cancel the deep dive modifications in the entries
	 * this function is called when the user click on the x (cross) button
	 * @param : nothing
	 * @return : nothing
	 */
	$('.closeOverlay-btn').click(function () {

		document.getElementById("myNav").style.height = "0%";

		//we enable all the previously blocked input
		document.getElementById("StatusSelectModifTick").disabled = false;
		document.getElementById("TicketType").disabled = false;
		document.getElementById("CategorieSelect").disabled = false;
		document.getElementById("ClientSelect").disabled = false;
		document.getElementById("AskerSelect").disabled = false;
		document.getElementById("ObjectText").disabled = false;
		document.getElementById("DescriptionText").disabled = false;
		document.getElementById("CreationDate").disabled = false;
		document.getElementById("DateInput").disabled = false;
		document.getElementById("skills").disabled = false;
		document.getElementById("InterventionPlace").disabled = false;
		document.getElementById("InterventionDateInput").disabled = false;
		document.getElementById("InterventionTimeInput").disabled = false;
		document.getElementById("TechnicPeopleList").disabled = false;
		document.getElementById("PrevisibleTimeInput").disabled = false;
		document.getElementById("EffectiveTimeInput").disabled = false;

		//document.getElementById("FormOverlay").style.height = "0%";

	});

	$('#validation-btn').click(() => {
		let ticketsToUpdate = []
		let parentTicketID = document.getElementById("ID-ticket").innerText;
		ticketsToUpdate.push(ticketMap[parentTicketID]);

		for (let i in graphMap[parentTicketID]) {
			let subticketID = graphMap[parentTicketID][i];
			ticketsToUpdate.push(ticketMap[subticketID]);
		}

		console.log(ticketsToUpdate);
		
		$.ajax({
			type: "POST",
			url: host + "/updatetickets",
			data: JSON.stringify(ticketsToUpdate),
			contentType: 'json', // Non present -> erreur serveur
			success: function (response, status, jqXHR) {
				console.log("Tickets updated!!");
			},
			error: function (jqXHR, status, errorThrown) {
				console.log("ERROR!" + status + "\n" + errorThrown);
			}
		});
		
	});

	// Accordion management : We add the Click event listener to it 
	// For the moment, the only accordion is the sub-ticket creation menu
	{
		let acc = document.getElementsByClassName("accordion");
		let i;

		for (i = 0; i < acc.length; i++) {
			acc[i].addEventListener("click", function () {
				this.classList.toggle("active");
				let panel = this.nextElementSibling;
				if (panel.style.maxHeight) {
					panel.style.maxHeight = null;
				} else {
					panel.style.maxHeight = panel.scrollHeight + "px";
				}
			});
		}

	}

	$.ajax({
		type: "POST",
		url: host + "/getalltickets",
		dataType: 'json',
		contentType: 'json', // Non present -> erreur serveur
		success: function (response, status, jqXHR) {
			//First, we complete the dependencies graph
			for (let i = 0; i < response.length; i++) {

				let ticket = response[i];
				let id = ticket["id"];
				let parentID = ticket["id_parent"];
				

				//we add our ticket to the main map
				//ticketMap.set(id, ticket);
				ticketMap[id] = ticket;

				//if the ticket has a parent
				if (parentID != null) {

					//if the parent is already in the graphmap
					if ( /*graphMap.has(parentID)*/ parentID in graphMap) {

						//double safety to ensure the creation of the the Array
						if (graphMap[parentID] == null) {
							//graphMap.set(parentID, new Array(id));
							graphMap[parentID] = new Array(id);
						} else {
							//we just add the subTicket-ID to the list of subTicket
							graphMap[parentID].push(id);
						}

					} else {
						//Otherwise, we create the new entry in the map and our subticket as an element of an array
						//graphMap.set(parentID, new Array(id));
						graphMap[parentID] = new Array(id);
					}

				} else {

					//We consider our ticket to be on the top of the dependencies graph 
					//graphMap.set(id, new Array());
					graphMap[id] = new Array();
				}
			}

			//We create a fragment where we are going to make all the changes
			let fragmentStorage = document.createDocumentFragment();

			//Then we add all the main rows to the UI
			for (let k in graphMap) {
				let ticket = ticketMap[k];
				let ID = ticket["id"];
				let status = ticket["status"];

				let callDate = new Date(ticket["call_date"]);
				let category = ticket["category"];
				let type = ticket["type"];
				let companyName = ticket["client"];
				let weight = ticket["weight"];

				//progression variables
				let totalSubTicketNumber = graphMap[ID].length;
				let totalWeight = 0;
				let totalFinish = 0;
				let totalFinishWeight = 0;

				let childrenList = graphMap[ID];

				//we iterate over all the sub ticket to get the progression
				for (let j in childrenList) {
					let subTicketID = childrenList[j];
					let subTicket = ticketMap[subTicketID];

					// subTicket properties
					let s = subTicket["status"].toLowerCase();
					let w = subTicket["weight"];

					totalWeight = totalWeight + w;

					totalFinishWeight = totalFinishWeight + w*computeProgressionFromStatus(status);

					
				}

				//compute the progression
				let progression = computeProgressionFromStatus(status);
								
				if(childrenList.length != 0){
					//compute the progression
					progression = (totalFinishWeight) / (totalSubTicketNumber * totalWeight);
				}

				//we add the parent to the UI
				addRow(fragmentStorage, status, ID, callDate.toISOString().substring(0,10), category, type, companyName, progression, true, weight, "");
			}

			//for every father ticket...
			for( let i in graphMap){	

				let children = graphMap[i];
				
				//Then we add all the child rows to the UI
				for (let j in children) {
					
					let ticket = ticketMap[children[j]];
					
					let ID = ticket["id"];
					let parentID = ticket["id_parent"];
					let status = ticket["status"];
					//TODO : format callDate correctly
					let callDate = new Date(ticket["call_date"]);
					let category = ticket["category"];
					let type = ticket["type"];
					let companyName = ticket["client"];
					let weight = ticket["weight"];

					

					//we add the child to the UI
					addRow(fragmentStorage, status, ID, callDate.toISOString().substring(0,10), category, type, companyName, computeProgressionFromStatus(status), false, weight, parentID);

				}
				
			}

			let ticketTable = document.getElementById('ticket-table');
			ticketTable.appendChild(fragmentStorage);

		},
		error: function (jqXHR, status, errorThrown) {
			console.log("ERROR!" + status + "\n" + errorThrown);
		}
	});

}
/**
 * Function that show the ticket menu overlay
 * @param : nothing
 * @return : nothing
 */
function showOverlay() {

	document.getElementById("myNav").style.width = "100%";
	document.getElementById("myNav").style.height = "100%";
}




/**
 * Function that get all the HTML rows from the table and put it in an home-made structure (more convenient to use)
 * @param : nothing
 * @return the table in an home-made JSON object 
 * its format is the following :
 * [uniqueId of the row, [index of the main row in the table, nb of sub-rows, HTML <tbody> containing the main row and all its sub-rows]]
 */
function getTableStructure() {
	var table, rows;
	table = document.getElementById("ticket-table");

	rows = table.rows;
	var tableStructure = new Map();
	let rowInfo = [];
	let idRow = 0;

	for (let i = 1; i <= (rows.length - 1); i++) {

		if (rows[i].className != "parent") {
			continue;
		} else {
			let contentRowNumber = 0;

			for (let j = i + 1; j <= (rows.length - 1); j++) {

				//last element
				if (j == (rows.length - 1)) {
					rowInfo = [i, j - i - 1]; // -1 => One header line
					tableStructure.set(idRow, [rowInfo, rows[i].closest('tbody')]);
					rowInfo = [];
					idRow++;
					i = j - 1;
					break;
				}

				//Normal case
				if (rows[j].className != "parent") {
					contentRowNumber++;
					continue;
				} else {
					rowInfo = [i, j - i - 2]; // -2 => One header line + The current line (the following parent)
					tableStructure.set(idRow, [rowInfo, rows[i].closest('tbody')]);
					rowInfo = [];
					idRow++;
					i = j - 2;
					break;
				}
			}
		}
	}

	return tableStructure;

}

/**
 * Function to sort descending the table of tickets
 * @param n : integer. Index number of the column we want to sort
 * @return : nothing
 */
function sortDescTable(n) {

	//if the column to sort is the first one (the "modifier" button) : we don't do anything
	if (n == 0)
		return;

	//get the ref to the HTML table to order
	var table = document.getElementById("ticket-table");

	//Get all the sortable rows then put them in an Array
	let sortableRows = getTableStructure();
	let tableRows = Array.from(sortableRows);

	//Insertion sort algorithm
	for (let i = 1; i < tableRows.length; i++) {

		let x = tableRows[i];
		let tbody1 = tableRows[i][1][1];
		let row1 = tbody1.firstElementChild;

		let j = i;

		let prevVal = row1.cells[n];

		while (j > 0 && (prevVal.innerText.toLowerCase() > tableRows[j - 1][1][1].firstElementChild.cells[n].innerText.toLowerCase())) {

			tableRows[j] = tableRows[j - 1];
			j--;

		}

		tableRows[j] = x;
	}

	//reorder table according to the sorted array
	for (let i = 1; i < tableRows.length; i++) {

		//As the element are already in the table, it will only move them (not append them again)
		table.appendChild(tableRows[i][1][1]);

	}

}


//Function to sort ascending : contain bugs for the moment...
/*function sortAscTable(n) {
	
	
	//get the ref to the HTML table to order
	var table = document.getElementById("ticket-table");

	//Get all the sortable rows then put them in an Array
	let sortableRows = getTableStructure();
	let tableRows = Array.from(sortableRows);
	
	//Insertion sort algorithm
	for(let i=1; i<tableRows.length;i++){
		
		let x = tableRows[i];
		let tbody1 = tableRows[i][1][1];
		let row1 = tbody1.firstElementChild;
	
		let j = i;
		
		let prevVal = row1.cells[n];

		while(j>0 && (prevVal.innerText.toLowerCase() < tableRows[j-1][1][1].firstElementChild.cells[n].innerText.toLowerCase()) ){
			
			tableRows[j]=tableRows[j-1];
			j--;

		}
		
		tableRows[j] = x;
	}
	
	//reorder table according to the sorted array
	for(let i=1; i<tableRows.length;i++){
	
		//As the element are already in the table, it will only move them (not append them again)
		table.appendChild(tableRows[i][1][1]);
		
	}

}*/

/**
 * Function that filters the row of the table according to a given value
 * @param n : integer. Index number of the column we want to filter
 * @param value : string. filter value on the rows of the table (we want to have at least this value into the rows)
 * @return : nothing
 */
function filterTable(n, value) {

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
		let cellVal = row1.cells[n];

		// Debug help :
		// console.log(cellVal.innerText.toLowerCase() + "\t|\t" + value);
		// console.log(!cellVal.innerText.toLowerCase().includes(value.toLowerCase()));
		// console.log("\n------------------------------------------------------------\n");

		//if the row includes the filter : we keep it (remove display none if it was here)
		if (cellVal.innerText.toLowerCase().includes(value.toLowerCase())) {
			tbody1.style.display = "";
		} else {
			tbody1.style.display = "none";
		}
	}
}


/**
 * Function that returns the correct HTML markup (its color mostly) given a ticket status
 * @param status : the status value of the ticket from the one in the form (all in one word)
 * @return HTML markup : string representing the HTML markup of the colored cell representing the status
 */
function getStatusColored(status) {

	//status is the value of the form (user selection)
	let s = status.toLowerCase();
	switch (s) {
		case "brouillon":
			return "<td><span style=\"color:olive;\">Brouillon</span></td>";
			//-----------------------------//
		case "requiert affectation":
			return "<td><span style=\"color:purple;\">Requiert affectation</span></td>";
			//-----------------------------//		
		case "en attente":
			return "<td><span style=\"color:darkorange;\">En attente</span></td>";
			//-----------------------------//		
		case "intervention planifiée":
			return "<td><span style=\"color:teal;\">Intervention planifiée</span></td>";
			//-----------------------------//		
		case "en cours":
			return "<td><span style=\"color:darkblue;\">En cours</span></td>";
			//-----------------------------//		
		case "fermé":
			return "<td><span style=\"color:darkgreen;\">Fermé</span></td>";
			//-----------------------------//		
		case "annulé":
			return "<td><span style=\"color:maroon;\">Annulé</span></td>";
	}


}

/**
 * Function that add a row in the main ticket table (in ticket view)
 * @param hostElement, the element we append our lines to
 * @param status : string representing the status of the ticket
 * @param ID : int representing the ID of the ticket
 * @param date : string representing the date of the ticket
 * @param category : string representing the category (Etude, Matériel, Température, etc.) of the ticket
 * @param type : string representing the type (incident/demande) of the ticket
 * @param company : string representing the company name of the client 
 * @param progression : int representing the progression of the ticket (between 0 and 100)
 * @param isMainTicket : boolean answering the question : do we create a main ticket ?
 * @param weight : int representing the weight of the sub-ticket (if it is a sub-ticket)
 * @param fatherID : int representing the ID of the father ticket we need to insert the newly created sub-ticket
 * @return : nothing...
 */
function addRow(hostElement, status, ID, date, category, type, company, progression, isMainTicket, weight, fatherID) {

	//We retrieve the table
	let table = document.getElementById('ticket-table');

	//If the row is a main ticket (a clickable row)
	if (isMainTicket) {
		//We create a tbody for eache clickable row
		let tbody = document.createElement('tbody');
		//if we need to insert a class to our tbody : tbody.classList.add('');

		//The ID of the tbody is the id of the ticket
		tbody.id = ID;

		//We create a new row on top
		let row = tbody.insertRow(0);
		row.classList.add('parent');

		//Fill the row
		row.insertCell(0).innerHTML = "<td><button class=\"modify-btn\">Modifier</button></td>"; //Insert the "modifier" button
		row.insertCell(1).innerHTML = getStatusColored(status);
		row.insertCell(2).innerHTML = ID;
		row.insertCell(3).innerHTML = date;
		row.insertCell(4).innerHTML = category;
		row.insertCell(5).innerHTML = type;
		row.insertCell(6).innerHTML = company;
		row.insertCell(7).innerHTML = progression + "%";


		//We create the header row on top
		let headerRow = tbody.insertRow(-1);
		headerRow.classList.add('cchild');

		//We hardcode the header row...
		headerRow.innerHTML = "<th unselectable=true  scope=\"col\">Poids du sous-ticket</th>\n" +
			"<th unselectable=true  scope=\"col\"> Etat du Ticket </th>\n" +
			"<th unselectable=true  scope=\"col\"> ID Ticket </th>\n" +
			"<th unselectable=true  scope=\"col\">Date</th>\n" +
			"<th unselectable=true  scope=\"col\"> Catégorie de la demande </th>\n" +
			"<th unselectable=true  scope=\"col\"> Type du Ticket </th>\n" +
			"<th unselectable=true  scope=\"col\"> Entreprise Cliente </th>\n" +
			"<th unselectable=true  scope=\"col\">Taux d'avancement</th>";

		//We append the new tbody to the table
		hostElement.appendChild(tbody);

	}
	//If the row is a sub-row
	else {

		//We look for the correct tbody (the correct row)
		let tbody = table.tBodies.namedItem(fatherID);

		//if we try to bufferize the addition, we need to look for the tbody in the hostElement
		if (tbody == null) {
			tbody = hostElement.getElementById(fatherID);
		}

		//If the father does exist
		if (tbody != null) {

			//We create a new row on top
			let row = tbody.insertRow(-1);
			row.classList.add('cchild');

			//Fill the row with all the cells
			row.insertCell(0).innerHTML = weight; //Insert the "modifier" button
			row.insertCell(1).innerHTML = getStatusColored(status);
			row.insertCell(2).innerHTML = ID;
			row.insertCell(3).innerHTML = date;
			row.insertCell(4).innerHTML = category;
			row.insertCell(5).innerHTML = type;
			row.insertCell(6).innerHTML = company;
			row.insertCell(7).innerHTML = progression + "%";

			//We append the new tbody to the table
			hostElement.appendChild(tbody);
		}
		//Otherwhise : ERROR => invalid usage of the function
		else {
			console.log("INVALID SUB-TICKET CREATION ! Wrong Father ID");
		}
	}
}

function addSubTicketRow(hostElement, subTicket) {
	
	//We retrieve the table
	let subTicketTable = document.getElementById('subTicketTable');
	
	//We create a new row on top
	let row = subTicketTable.insertRow(-1);
	
	let ticket = ticketMap[subTicket];
	
	
	// let ID 		= ticket["id"];
		// let parentID= ticket["id_parent"];
		
		// if(parentID==null){
			// parentID = "/";
		// }
		
		// let status	= ticket["status"];
		// let type	= ticket["type"];
		// let category= ticket["category"];
		
		// let companyName = ticket["client"];
		// let CompanyPrio = ticket["priority"];
		
		// let askerName = ticket["asker_name"];
		// let askerEmail= ticket["asker_email"];
		
		// let object 		= ticket["object"];
		// let description = ticket["description"];
		
		// let creationDate= new Date(ticket["creation_date"]).toISOString().substring(0,10);
		// let callDate	= new Date(ticket["call_date"]).toISOString().substring(0,10);
		
		// let requiredSkills = ticket["required_skills"];
		
		// console.log(requiredSkills);
		
		let interventionAddress	= ticket["address"];
		let interventionDateTime= ticket["intervention_datetime"];
		let interventionDate = new Date(interventionDateTime).toISOString().substring(0,10);
		let interventionTime = new Date(interventionDateTime).toISOString().substring(11,16);

		// let technicianName	= ticket["technician_name"];
		// let technicianID	= ticket["technician_id"];
		
		// let plannedDuration	= ticket["planned_duration"];
		// let actualDuration	= ticket["actual_duration"];
		
		// let comments = ticket["comments"];
	
	
	let weight	= ticket["weight"];
	
	
	
	let statusSelect = document.createElement("SELECT");
	
	let s1 = document.createElement("option");
	s1.setAttribute("value", "Brouillon");
	let t1 = document.createTextNode("Brouillon");
	s1.appendChild(t1);
	
	let s2 = document.createElement("option");
	s2.setAttribute("value", "Requiert Affectation");
	let t2 = document.createTextNode("Requiert Affectation");
	s2.appendChild(t2);
	
	let s3 = document.createElement("option");
	s3.setAttribute("value", "En attente");
	let t3 = document.createTextNode("En Attente");
	s3.appendChild(t3);
	
	let s4 = document.createElement("option");
	s4.setAttribute("value", "Intervention planifiée");
	let t4 = document.createTextNode("Intervention Planifiée");
	s4.appendChild(t4);
	
	let s5 = document.createElement("option");
	s5.setAttribute("value", "En cours");
	let t5 = document.createTextNode("En Cours");
	s5.appendChild(t5);
	
	let s6 = document.createElement("option");
	s6.setAttribute("value", "Fermé");
	let t6 = document.createTextNode("Fermé");
	s6.appendChild(t6);
	
	let s7 = document.createElement("option");
	s7.setAttribute("value", "Annulé");
	let t7 = document.createTextNode("Annulé");
	s7.appendChild(t7);
	
	statusSelect.appendChild(s1);
	statusSelect.appendChild(s2);
	statusSelect.appendChild(s3);
	statusSelect.appendChild(s4);
	statusSelect.appendChild(s5);
	statusSelect.appendChild(s6);
	statusSelect.appendChild(s7);
	

	let categorySelect = document.createElement("select");
	
	var option = document.createElement("option");
	option.text = "";
	option.value = "";
	categorySelect.add(option);

	categoryList.forEach(function(element){			
		 
		var option = document.createElement("option");
		option.text = element["nom"];
		option.value = element["nom"];
		categorySelect.add(option);
	});
	
	let skillsSelect = document.createElement("select");
	
	skillsSelect.add(option);
	
	skillList.forEach(function(element){			
		  
		var option = document.createElement("option");
		option.text = element["nom"];
		option.value = element["nom"];
		skillsSelect.add(option);
	});
	
	row.setAttribute("id", subTicket);
		
	//Fill the row with all the cells
	row.insertCell(0).innerHTML = subTicket;
	row.insertCell(1).innerHTML = "<select id=\"subTicketStatusSelect\">" + statusSelect.innerHTML + "</select>";
	row.insertCell(2).innerHTML = "<select id=\"subTicketCategorySelect\">" + categorySelect.innerHTML + "</select>";
	row.insertCell(3).innerHTML = "<input type=\"number\" id=\"subTicketWeight\" value=" + weight +">";
	row.insertCell(4).innerHTML = "<select id=\"subTicketSkillSelect\" multiple>" + skillsSelect.innerHTML + "</select>"; 
	row.insertCell(5).innerHTML = "<input id=\"subTicketInterventionAddress\" value=\'" + interventionAddress +"\'>";
	row.insertCell(6).innerHTML = "<input class=\"formElement\" id=\"subTicketInterventionDate\" type=\"date\" value=" + interventionDate +">";
	
	hostElement.appendChild(row);
	
}



/**
 * Method that gives a percentage of the completion of a ticket given a status
 * @param status : status of the given ticket
 * @return the completion percentage
 */
function computeProgressionFromStatus(status){

	//status is the value of the form (user selection)
	let s = status.toLowerCase();
	switch (s) {
		case "brouillon":
			return 0;
			//-----------------------------//
		case "requiert affectation":
			return 100/5;
			//-----------------------------//		
		case "en attente":
			return 200/5;
			//-----------------------------//		
		case "intervention planifiée":
			return 300/5;
			//-----------------------------//		
		case "en cours":
			return 400/5;
			//-----------------------------//		
		case "fermé":
			return 100;
			//-----------------------------//		
		case "annulé":
			return 0;
	}
	
}


/**
 * Function to add a comment to an intervention
 * @param text, the comment text to add
 * @return nothing
 */
function addComment(text) {

	//we create a paragraph
	let paragraph = document.createElement("p");
	paragraph.appendChild(document.createTextNode(text));
	//we add the right class to it
	paragraph.classList.add('comments');

	//we add it to the comment zone
	document.getElementById("CommentsZone").appendChild(paragraph);

}

/**
 * Function to remove all the comments in the overlay
 * @param nothing
 * @return nothing
 */
function resetComments() {

	let commentZone = document.getElementById("CommentsZone");
	commentZone.innerHTML = "";
	commentZone.id = "CommentsZone"; //extra safety
}