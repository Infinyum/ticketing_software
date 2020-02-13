//We use JavaScript's strict mode to ensure a high JavaScript code quality
"use strict";

//Grab the name of the host to use it 
var host = document.URL;

/**
 * Loading function of the application
 * Map all the events' callback to our functions
 * @param : nothing
 * @return : nothing
 */
window.onload = function () {

	//reset the filters' value
	document.getElementsByClassName('columnFilters').value = "";

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
	 * Anonymous Function that opens the creation/modif interface
	 * this function is called when the user click on the 'modifier' or 'créer un nouveau ticket' button
	 * @param : nothing
	 * @return : nothing
	 */
	$(document).on('click', '.modify-btn', function () {

		showOverlay();

	});

	/**
	 * Anonymous Function that opens the creation/modif interface
	 * this function is called when the user click on the 'modifier' or 'créer un nouveau ticket' button
	 * @param : nothing
	 * @return : nothing
	 */
	$(document).on('click', '#ticketCreation-btn', function () {

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

	});

	/**
	 * Anonymous Function that cancel the deep dive modifications in the entries
	 * this function is called when the user click on the x (cross) button
	 * @param : nothing
	 * @return : nothing
	 */
	$('.closeOverlay-btn').click(function () {

		document.getElementById("myNav").style.height = "0%";
		//document.getElementById("FormOverlay").style.height = "0%";

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

	//TODO
	//EXAMPLE OF ROWS : Should be removed !
	addRow("enCours", 123456789, "2020-01-22", "Etude", "Demande", "Polytech", 100, true, 0, "");

	addRow("brouillon", 1234567811, "2020-01-21", "Etude", "Demande", "Polytech", 100, false, 2, "123456789");
	addRow("RequiertAffectation", 1234567811, "2020-01-21", "Etude", "Demande", "Polytech", 100, false, 2, "123456789");
	addRow("enAttente", 1234567811, "2020-01-21", "Etude", "Demande", "Polytech", 100, false, 2, "123456789");
	addRow("InterventionPlanifiee", 1234567810, "2020-01-21", "Etude", "Demande", "Polytech", 100, false, 2, "123456789");
	addRow("enCours", 1234567810, "2020-01-21", "Etude", "Demande", "Polytech", 100, false, 2, "123456789");
	addRow("ferme", 1234567811, "2020-01-21", "Etude", "Demande", "Polytech", 100, false, 2, "123456789");
	addRow("Annule", 1234567810, "2020-01-21", "Etude", "Demande", "Polytech", 100, false, 2, "123456789");

	$.ajax({
		type: "POST",
		url: "http://localhost:9000/getalltickets/",
		success: function (response, status, jqXHR) {
			for (let i = 0; i < response.length; i++) {
				// TODO
				//console.log(response[i]);
			}
		},
		error: function (jqXHR, status, errorThrown) {
			console.log("ERROR!");
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
		case "requiertaffectation":
			return "<td><span style=\"color:purple;\">Requiert Affectation</span></td>";
			//-----------------------------//		
		case "enattente":
			return "<td><span style=\"color:darkorange;\">En Attente</span></td>";
			//-----------------------------//		
		case "interventionplanifiee":
			return "<td><span style=\"color:teal;\">Intervention Planifiée</span></td>";
			//-----------------------------//		
		case "encours":
			return "<td><span style=\"color:darkblue;\">En Cours</span></td>";
			//-----------------------------//		
		case "ferme":
			return "<td><span style=\"color:darkgreen;\">Fermé</span></td>";
			//-----------------------------//		
		case "annule":
			return "<td><span style=\"color:maroon;\">Annulé</span></td>";
	}


}

/**
 * Function that add a row in the main ticket table (in ticket view)
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
function addRow(status, ID, date, category, type, company, progression, isMainTicket, weight, fatherID) {

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
		table.appendChild(tbody);
	}
	//If the row is a sub-row
	else {

		//We look for the correct tbody (the correct row)
		let tbody = table.tBodies.namedItem(fatherID);

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
			table.appendChild(tbody);

		}
		//Otherwhise : ERROR => invalid usage of the function
		else {
			console.log("INVALID SUB-TICKET CREATION ! Wrong Father ID");
		}

	}
}