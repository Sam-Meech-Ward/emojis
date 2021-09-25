const express = require('express')
const app = express()
const ec2Meta = require('./ec2Meta')
const emojis = require('./emojis.json')
const random = require('just-random')

app.get("/", (req, res) => {
  res.send(random(emojis).emoji)  
})

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