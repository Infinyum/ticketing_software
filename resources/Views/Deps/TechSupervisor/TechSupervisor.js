//We use JavaScript's stict mode to ensure a high JavaScript code quality
"use strict";

//TechSupervisor exclusive code
window.addEventListener('load', function() {
    //this.document.getElementById("StatusSelectListHead").value = "Brouillon";
    //$('#StatusSelectListHead').trigger('input');

    // Another listener to manage list of technician when modifying a ticket
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

    $(document).on('change', '#clientPriorityFilterBtn', function() {
        let tablerows = document.getElementById('ticket-table').tBodies;
        if(this.checked) {
            let row = null;
            for(let i = 0; i < tablerows.length; i++) {
                row = ticketMap[tablerows[i].id];
                if(!row.priority)
                    tablerows[i].style.display = "none";
            }
        }
        else {
            filterTable(1, document.getElementById('StatusSelectListHead').value);
        }
    });
});