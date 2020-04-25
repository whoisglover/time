const express = require('express')
const moment = require('moment-timezone')
const app = express()
const port = 3000

app.get('/time', (req, res) => {
  console.log('in the /time request')

  const zoneProvided = req.query.zone
  const strictMode = req.query.strict

  const zones = moment.tz.names()
  const validZone = zones.includes(zoneProvided)

  //if a zone was provided and strict mode is set to true, return error if zone is not valid
  if(strictMode && zoneProvided && !validZone) {
    res.status(400).send("Invalid time zone provided. /time-zones is available for a full list.")
  } else {
    let time = moment().format('HH:mm:ss')
    if(validZone) {
      time = moment().tz(zoneProvided).format('HH:mm:ss')
    }
    const response = {time}
    res.send(response)
  }
})

app.get('/time-zones', (req, res) => {

  const zones = moment.tz.names()
  console.log(zones)


  res.send(zones)
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
