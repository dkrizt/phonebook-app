const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const Person = require("./models/person");
const cors = require("cors");

const app = express();
// const PORT = process.env.PORT || 3001;

const phonebook = [];

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

// Define a custom token to log request body
morgan.token("body", (req) => JSON.stringify(req.body));

// Use morgan with 'tiny' format and the custom token
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  // Check if name or number is missing in formdata
  if (!name || !number) {
    return res.status(400).json({ error: "Name or number is missing" });
  }
  const person = new Person({
    name,
    number,
  });
  person.save().then((savedPerson) => {
    // Respond with the new person and a 201 Created status
    return res.status(201).json(savedPerson);
  });
});

app.get("/info", (req, res) => {
  const totalPersons = Person.length;
  const currentTime = new Date();

  res.send(
    `<div>
      <p>phonebook has info for ${totalPersons} people</p>
      <p>${currentTime}</p>
    </div>`
  );
});

const mongoose = require("mongoose");

/* app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ID format" });
  }

  // Find the person by ID
  Person.findById(id)
    .then((person) => {
      if (!person) {
        return res.status(404).send({ error: "Person not found in phonebook" });
      }
      res.json(person);
    })
    .catch((err) => {
      console.error(err); // Log the error for debugging
      res.status(500).send({ error: "An unexpected error occurred" });
    });
});
 */

app.get('/api/persons/:id', (req, res) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ error: "Person not found" });
      }
      res.status(204).end(); // Successfully deleted
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({ error: "Malformed ID or other error" });
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
