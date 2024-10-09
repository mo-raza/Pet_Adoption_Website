const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();
const port = 7860;

const LOGIN_FILE = path.join(__dirname, 'logins.txt');
const PET_FILE = path.join(__dirname, 'pets.txt');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Setup sessions
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Define routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/browse', (req, res) => {
  res.render('browse', { title: 'Browse Available Pets' });
});

app.get('/find', (req, res) => {
  res.render('find', { title: 'Find a Dog/Cat' });
});

app.get('/dcare', (req, res) => {
  res.render('dcare', { title: 'Dog Care' });
});

app.get('/ccare', (req, res) => {
  res.render('ccare', { title: 'Cat Care' });
});

app.get('/away', (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/login');
    return;
  }
  res.render('away', { title: 'Have a pet to give away' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});


app.get('/privacy', (req, res) => {
  res.render('privacy', { title: 'Privacy Statement' });
});


app.get('/register', (req, res) => {
  res.render('register', { title: 'Create Account' });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

  if (!usernameRegex.test(username)) {
    res.status(400).send('Invalid username format. Only letters and digits are allowed.');
    return;
  }

  if (!passwordRegex.test(password)) {
    res.status(400).send('Invalid password format. Must be at least 4 characters long, containing letters and digits, with at least one letter and one digit.');
    return;
  }

  // Check if the username already exists
  fs.readFile(LOGIN_FILE, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Server error. Please try again later.');
      return;
    }

    const users = data.split('\n').filter(Boolean).map(line => line.split(':')[0]);
    if (users.includes(username)) {
      res.status(400).send('Username already exists. Please choose another one.');
      return;
    }

    // Append the new user's data to the file
    const newUser = `${username}:${password}\n`;
    fs.appendFile(LOGIN_FILE, newUser, (err) => {
      if (err) {
        res.status(500).send('Server error. Please try again later.');
        return;
      }

      res.redirect('/register-success');
    });
  });
});

app.get('/register-success', (req, res) => {
  res.render('register-success', { title: 'Registration Successful' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile(LOGIN_FILE, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Server error. Please try again later.');
      return;
    }

    const users = data.split('\n').filter(Boolean);
    const user = users.find(line => {
      const [storedUsername, storedPassword] = line.split(':');
      return storedUsername === username && storedPassword === password;
    });

    if (user) {
      req.session.loggedIn = true;
      req.session.username = username;
      res.redirect('/away');
    } else {
      res.status(400).send('Invalid login credentials. Please try again.');
    }
  });
});

app.post('/away', (req, res) => {
  if (!req.session.loggedIn) {
    res.status(403).send('You must be logged in to submit a pet.');
    return;
  }

  const { animal, breed, age, gender, withcats, withdogs, withchildren, na, moreinfo, ownername, owneremail } = req.body;
  const username = req.session.username;

  fs.readFile(PET_FILE, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Server error. Please try again later.');
      return;
    }

    const lines = data.split('\n').filter(Boolean);
    const id = lines.length + 1;

    const newPet = `${id}:${username}:${animal}:${breed}:${age}:${gender}:${withcats ? 1 : 0}:${withdogs ? 1 : 0}:${withchildren ? 1 : 0}:${na ? 1 : 0}:${moreinfo}:${ownername}:${owneremail}\n`;
    fs.appendFile(PET_FILE, newPet, (err) => {
      if (err) {
        res.status(500).send('Server error. Please try again later.');
        return;
      }

      res.redirect('/away-success');
    });
  });
});

app.get('/away-success', (req, res) => {
  res.render('away-success', { title: 'Pet Submission Successful' });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.render('logout', { title: 'Logged Out' });
  });
});


app.post('/find', (req, res) => {
  const { animal, breed, age, gender, withcats, withdogs, withchildren } = req.body;

  fs.readFile(PET_FILE, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Server error. Please try again later.');
      return;
    }

    const pets = data.split('\n').filter(Boolean).map(line => {
      const [id, user, petAnimal, petBreed, petAge, petGender, petWithCats, petWithDogs, petWithChildren] = line.split(':');
      return {
        id,
        user,
        animal: petAnimal,
        breed: petBreed,
        age: petAge,
        gender: petGender,
        withCats: petWithCats === '1',
        withDogs: petWithDogs === '1',
        withChildren: petWithChildren === '1'
      };
    });

    // Filter pets based on the form input
    const filteredPets = pets.filter(pet => {
      return (
        (animal === '' || pet.animal === animal) &&
        (breed === '' || breed === 'na' || pet.breed === breed) &&
        (age === '' || age === 'na' || pet.age === age) &&
        (gender === '' || gender === 'na' || pet.gender === gender) &&
        (withcats === undefined || pet.withCats) &&
        (withdogs === undefined || pet.withDogs) &&
        (withchildren === undefined || pet.withChildren)
      );
    });

    res.render('find-results', { title: 'Search Results', pets: filteredPets });
  });
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
