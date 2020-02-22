//We use JavaScript's stict mode to ensure a high JavaScript code quality
"use strict";

//Admin exclusive code
window.onload = function () {
  $(document).on('click', '#addCompte', function () {

  });

  $(document).on('click', '#delCompte', function () {

  });

  $(document).on('click', '#addSkill', function () {
    var skill = document.getElementById("existingSkill");
    var skillInput = document.getElementById("newSkill").value;
    skill.options.add(new Option(skillInput,skillInput));
    document.getElementById("newSkill").value = "";
  });

  $(document).on('click', '#delSkill', function () {
    var skill = document.getElementById("existingSkill");
    var index = skill.selectedIndex;
    skill.options.remove(index);
  });

  $(document).on('click', '#addCat', function () {
    var cat = document.getElementById("existingCat");
    var catInput = document.getElementById("newCategory").value;
    cat.options.add(new Option(catInput,catInput));
    document.getElementById("newCategory").value = "";
  });

  $(document).on('click', '#delCat', function () {
    var cat = document.getElementById("existingCat");
    var index = cat.selectedIndex;
    cat.options.remove(index);
  });
}
