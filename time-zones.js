const express = require('express')
const moment = require('moment-timezone')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express()
const port = process.env.PORT || 3000



/**
 * @swagger
 * path:
 *  /time:
 *    get:
 *      summary: Fetch the wall clock time of the server
 *      tags: [Time]
 *      parameters:
 *        - in: query
 *          name: zone
 *          schema:
 *            type: string
 *            example: America/New_York
 *          required: false
 *          description: Timezone to return the time in
 *        - in: query
 *          name: strict
 *          schema:
 *            type: boolean
 *          required: false
 *          description: Strict Mode - if enabled and Time Zone is provided, the zone must be valid
 *      responses:
 *        "200":
 *          description: OK
 *          examples:
 *            application/json: {"time":"23:23:11"}
 *        "400":
 *          description: Strict mode enabled and invalid Time Zone provided
 *
 *
 */
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



/**
 * @swagger
 * path:
 *  /time-zones:
 *    get:
 *      summary: Fetch an array of time zones
 *      tags: [Time]
 *      responses:
 *        "200":
 *          description: OK
 *
 */
app.get('/time-zones', (req, res) => {

  const zones = moment.tz.names()
  console.log(zones)


  res.send(zones)
})


// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Danny's Time API",
      version: "1.0.0",
      description:
        "A simple project to return the wall clock time of server.",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/"
      },
      contact: {
        name: "Danny Glover",
        url: "http://github.com/whoisglover",
        email: "djglover00@gmail.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000"
      },
      {
        url: "https://immense-oasis-84897.herokuapp.com/"
      },
    ]
  },
  apis: ["./time-zones.js"]
};
const specs = swaggerJsdoc(options);


app.use("/", swaggerUi.serve)
app.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true
  })
);

app.use("/docs", swaggerUi.serve);
app.get(
  "/docs",
  swaggerUi.setup(specs, {
    explorer: true
  })
);

app.listen(port, () => console.log(`Time Zones API listening at http://localhost:${port}`))
