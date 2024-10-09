function updateDateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString();
    document.getElementById('datetime').textContent = `${dateString} ${timeString}`;
}
setInterval(updateDateTime, 1000);


function validateForm(event) {
    // Get form fields
    var animal = document.getElementById("animal").value;
    var breed = document.getElementById("breed").value;
    var age = document.getElementById("age").value;
    var gender = document.getElementById("gender").value;
    var withcats = document.getElementById("withcats").checked;
    var withdogs = document.getElementById("withdogs").checked;
    var withchildren = document.getElementById("withchildren").checked;
    var na = document.getElementById("na").checked;

    // Check for empty fields or unchecked checkbox group
    if (animal === "" || breed === "" || age === "" || gender === "" || (!withcats && !withdogs && !withchildren && !na)) {
        alert("All fields are required and at least one checkbox must be selected.");
        // Prevent form submission if not completed
        event.preventDefault();
    } else {
        document.getElementById("findform").submit();
    }
}


function validateAwayForm(event) {
    // Get form fields
    var animal = document.getElementById("animal").value;
    var breed = document.getElementById("breed").value;
    var age = document.getElementById("age").value;
    var gender = document.getElementById("gender").value;
    var withcats = document.getElementById("withcats").checked;
    var withdogs = document.getElementById("withdogs").checked;
    var withchildren = document.getElementById("withchildren").checked;
    var na = document.getElementById("na").checked;
    var info = document.getElementById("moreinfo").value;
    var name = document.getElementById("ownername").value;
    var email = document.getElementById("owneremail").value;

    // Regex to check valid email format
    let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check for empty fields or unchecked checkbox group
    if (animal === "" || breed === "" || age === "" || gender === "" || info === "" || name === "" || 
        (!withcats && !withdogs && !withchildren && !na)) {
        alert("All fields are required and at least one checkbox must be selected.");
        // Prevent form submission if not completed
        event.preventDefault();
    } 
    // Check for valid email
    else if (email === "" || !pattern.test(email)) {
        alert("Please enter a valid email address.");
        // Prevent form submission 
        event.preventDefault();
    }
    else {
        document.getElementById("awayform").submit();
    }
}

document.getElementById('registrationForm').onsubmit = function(e) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

    if (!usernameRegex.test(username)) {
        message.innerText = 'Invalid username format. Only letters and digits are allowed.';
        e.preventDefault();
    } else if (!passwordRegex.test(password)) {
        message.innerText = 'Invalid password format. Must be at least 4 characters long, containing letters and digits, with at least one letter and one digit.';
        e.preventDefault();
    }
}

document.getElementById('loginForm').onsubmit = function(e) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
  
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;
  
    if (!usernameRegex.test(username)) {
      message.innerText = 'Invalid username format. Only letters and digits are allowed.';
      e.preventDefault();
    } else if (!passwordRegex.test(password)) {
      message.innerText = 'Invalid password format. Must be at least 4 characters long, containing letters and digits, with at least one letter and one digit.';
      e.preventDefault();
    }
  }
  