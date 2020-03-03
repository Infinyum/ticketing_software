//We use JavaScript's stict mode to ensure a high JavaScript code quality
"use strict";
var host = document.URL;

//Admin exclusive code
window.onload = function () {
    $(document).on('click', '#addCompte', function () {
        let id = document.getElementById("id").value;
        let pwd = document.getElementById("passwd").value;
        let hashedPwd = CryptoJS.SHA256(pwd).toString(CryptoJS.enc.Hex);
        
        let dd = document.getElementById("acctype");
        let accType = dd.options[dd.selectedIndex].value;

        /*$.ajax({
            type: "POST",
            url: host + "/addcompte",
            dataType: "json", //what we send
            contentType: "application/json", //what we expect as the response
            data: JSON.stringify({
                myAttributeName: value
            }),
            success: (element) => {
                $(".display").html("Ajouté avec succès!");
            },
            error: (xhr, ajaxOptions, thrownError) => {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });*/
    });

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