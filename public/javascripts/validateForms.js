// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.validated-form')

  // Loop over them and prevent submission
  // Make an array
  Array.from(forms)
    // for each form add an event listener
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        // If the form is not valid when submitted then do following
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()
