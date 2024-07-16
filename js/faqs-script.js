document.addEventListener("DOMContentLoaded", function () {
  var faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach(function (question) {
    question.addEventListener("click", function () {
      var answer = question.nextElementSibling;
      var questionImg = question.querySelector("img");

      var isCurrentlyVisible = answer.style.display === "block";

      document.querySelectorAll(".faq-answer").forEach(function (answer) {
        answer.style.display = "none";
      });
      document.querySelectorAll(".faq-question img").forEach(function (img) {
        img.style.removeProperty("transform");
      });
      faqQuestions.forEach(function (q) {
        q.classList.remove("active");
      });

      if (!isCurrentlyVisible) {
        answer.style.display = "block";
        questionImg.style.transform = "rotate(180deg)";
        question.classList.add("active");
      }
    });
  });
});
