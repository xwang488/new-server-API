const express = require("express")
const app = express()
require("dotenv").config()
const HTTP_PORT = process.env.PORT || 8080

const MoviesDB = require("./modules/moviesDB.js")
const db = new MoviesDB()

const cors = require("cors")
app.use(cors())

// query validation
const { query } = require('express-validator')

app.use(express.json())

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`server listening on: ${HTTP_PORT}`)
  })
}).catch((err) => {
  console.log(err)
})

app.get('/', (req, res) => {
  res.json({ massage: process.env.MONGODB_CONN_STRING })
})

//add new movie
app.post('/api/movies', async (req, res) => {
  try {
    let result = await db.addNewMovie(req.body)
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: `Unable to add new Movie:${err}` })
  }

})

//get movies with specific page and perPage
// app.get('/api/movies', [
//   query('page').isInt({ min: 1 }),
//   query('perPage').isInt({ min: 1 }),
//   query('title'),
// ], async (req, res) => {
//   const { page, perPage, title } = req.query
//   db.getAllMovies(page, perPage, title).then((data) => {
//     res.json(data)
//   }).catch((err) => {
//     res.status(404).json({ message: err })
//   })
// })

//get movies with specific page and perPage
app.get('/api/movies', async (req, res) => {
  console.log(req.query.page, req.query.perPage, req.query.title)
  db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data) => {
    res.json(data)
  }).catch((err) => {
    res.status(404).json({ message: err })
  })
})

//get movie by id

app.get('/api/movies/:id', async (req, res) => {
  try {
    let result = await db.getMovieById(req.params.id)
    res.json(result)
  } catch (err) {
    res.status(500).json({
      message: `No match was found!`,
      "Error": `${err}`
    })
  }
})

// app.get('/api/movies/:id', (req, res) => {
//   db.getMovieById(req.params.id).then((data) => {
//     res.json(data)
//   }).catch((err) => {
//     res.status(500).json({
//       message: `Unable to add find Movie id:${id}`,
//       Error: `${err}`
//     })
//   })
// })

//update movies by id
app.put('/api/movies/:id', async (req, res) => {
  try {
    let result = await db.updateMovieById(req.body, req.params.id)
    res.json(result)
  } catch (err) {
    res.status(500).json({
      message: `Unable to add update Movie id:${req.params.id}`,
      Error: `${err}`
    })
  }
})

//delete movies by id
app.delete('/api/movies/:id', async (req, res) => {
  try {
    let result = await db.deleteMovieById(req.params.id)
    res.status(204).end()
  } catch (err) {
    res.status(500).json({
      message: `Unable to delete Movie id:${req.params.id}`,
      Error: `${err}`
    })
  }
})

