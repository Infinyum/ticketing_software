//We use JavaScript's stict mode to ensure a high JavaScript code quality
"use strict";
var host = document.URL;

//Admin exclusive code
window.onload = function () {
    $(document).on('click', '#addCompte', function () {
        let id = document.getElementById("id").value;
        let name = document.getElementById("nom").value;
        let email = document.getElementById("email").value;
        let phone = document.getElementById("phone").value;
        
        let pwd = document.getElementById("passwd").value;
        let hashedPwd = "";
        if (pwd != "") {
            hashedPwd = CryptoJS.SHA256(pwd).toString(CryptoJS.enc.Hex);
        }
        
        let dd = document.getElementById("acctype");
        let accType = dd.options[dd.selectedIndex].text;

        let id_resp = null;

        if (document.getElementById("id_resp") != null) {
            id_resp = document.getElementById("id_resp").value;
        }

        if (id == "" || name == "" || email == "" || phone == "" || hashedPwd == "" || (id_resp != null && id_resp == "")) {
            applyInvalidStyle();
        } else {
            $.ajax({
                type: "POST",
                url: host + "/createcompte",
                dataType: "json", //what we send
                contentType: "application/json", //what we expect as the response
                data: JSON.stringify({
                    "id": id,
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "pwd": hashedPwd,
                    "acctype": accType,
                    "id_resp": id_resp
                }),
                success: (response, status, jqXHR) => {
                    // TODO: empty inputs + remove invalid style
                    console.log("Success!!");
                },
                error: (xhr, ajaxOptions, thrownError) => {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
        }
    });

    $("#acctype").change(() => {
        let dd = document.getElementById("acctype");
        if (dd.options[dd.selectedIndex].value == "tech") {
            document.getElementById("resptech").innerHTML = 'Identifiant du responsable :<input class="input" id="id_resp" type="text"><br />';
        } else {
            document.getElementById("resptech").innerHTML = "";
        }
    })

    $(document).on('click', '#delCompte', function () {
        
    });

    $(document).on('click', '#addSkill', function () {
        var skill = document.getElementById("existingSkill");
        var skillInput = document.getElementById("newSkill").value;
        skill.options.add(new Option(skillInput, skillInput));
        $.ajax({
            type: "POST",
            url: host + "/addcompetence",
            dataType: "json", //what we send
            contentType: "application/json", //what we expect as the response
            data: JSON.stringify({
                nom: skillInput
            }),
            beforeSend: function (xhr) {
                // alert("En cours d'ajout");
            },
            complete: function (xhr) {
                // alert("Ajout termine");
            },
            success: function (element) {
                alert("Ajouté avec succès!");
            }
        });
        document.getElementById("newSkill").value = "";
    });

    $(document).on('click', '#delSkill', function () {
        var skill = document.getElementById("existingSkill");
        var index = skill.selectedIndex;
        skill.options.remove(index);
        $.ajax({
            type: "POST",
            url: host + "/removecompetence",
            dataType: "json", //what we send
            contentType: "application/json", //what we expect as the response
            data: JSON.stringify({
                nom: skillInput
            }),
            beforeSend: function (xhr) {

            },
            complete: function (xhr) {

            },
            success: function (element) {
                alert("Supprimé avec succès!");
            }
        });
    });

    $(document).on('click', '#addCat', function () {
        var cat = document.getElementById("existingCat");
        var catInput = document.getElementById("newCategory").value;
        cat.options.add(new Option(catInput, catInput));
        $.ajax({
            type: "POST",
            url: host + "/addcategorie",
            dataType: "json", //what we send
            contentType: "application/json", //what we expect as the response
            data: JSON.stringify({
                nom: skillInput
            }),
            beforeSend: function (xhr) {

            },
            complete: function (xhr) {

            },
            success: function (element) {
                alert("Ajouté avec succès!");
            }
        });
        document.getElementById("newCategory").value = "";
    });

    $(document).on('click', '#delCat', function () {
        var cat = document.getElementById("existingCat");
        var index = cat.selectedIndex;
        cat.options.remove(index);
        $.ajax({
            type: "POST",
            url: host + "/removecategorie",
            dataType: "json", //what we send
            contentType: "application/json", //what we expect as the response
            data: JSON.stringify({
                nom: skillInput
            }),
            beforeSend: function (xhr) {

            },
            complete: function (xhr) {

            },
            success: function (element) {
                alert("Supprimé avec succès!");
            }
        });
    });
}

function applyInvalidStyle() {
    console.log("Not good!");
}