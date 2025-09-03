const express = require('express')
const cors = require('cors')
const path = require('path')

const apiRouter = require('./api')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', apiRouter)
app.use(express.static(path.join(__dirname, 'public')))

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)
})