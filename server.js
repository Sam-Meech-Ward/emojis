const express = require('express')
const ec2Meta = require('./ec2Meta')
const emojis = require('./emojis.json')
const random = require('just-random')
const morgan = require("morgan")

const app = express()

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))

app.get("/", (req, res) => {
  const emoji = random(emojis).emoji;
  res.send(`<h1 style="font-size: 400px;">${emoji}</h1>`)  
})

app.get("/all", (req, res) => {
  res.send(`<ul>${emojis.map((e) => `<li style="font-size: 50px;">${e.emoji}: ${e.text}</li>`).join("")}</ul>`);
});


app.get("/:emoji", (req, res) => {
  const emoji =
    emojis.find((e) => e.text.toLowerCase() == req.params.emoji.toLowerCase())
      ?.emoji || "🖕";
  res.send(`<h1 style="font-size: 400px;">${emoji}</h1>`);
});


app.get("/ec2", async (req, res) => {
  let ec2 = {}
  try {
    ec2.ipv4 = await ec2Meta.ipv4()
    ec2.hostname = await ec2Meta.hostname()
    ec2.instanceId = await ec2Meta.instanceId()
  } catch (err) {
    console.log(err)
    ec2 = "error"
  }
  res.send(ec2)
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listening on port ${port}`))