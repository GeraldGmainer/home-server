const express = require('express')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'))
const plugs = config.plugs
const port = process.env.PORT || config.port || 3500
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/status', async (req, res) => {
  try {
    console.log("Fetch plug status...")
    const results = await Promise.all(plugs.map(async (plug) => {
      try {
        const [powerResp, status8Resp] = await Promise.all([
          axios.get(`http://${plug.ip}/cm?cmnd=Power`),
          axios.get(`http://${plug.ip}/cm?cmnd=Status%208`)
        ])

        const watt = status8Resp.data?.StatusSNS?.ENERGY?.Power || 0

        return {
          name: plug.name,
          state: powerResp.data.POWER,
          url: `http://${plug.ip}/`,
          ip: plug.ip,
          watt
        }
      } catch (err) {
        console.warn(`Failed to get data from ${plug.ip}`, err.message)
        return {
          name: plug.name,
          state: 'UNKNOWN',
          url: `http://${plug.ip}/`,
          ip: plug.ip,
          watt: 0
        }
      }
    }))
    res.json(results)
    console.log("Fetching plug status done")
  } catch (err) {
    console.error("Status endpoint failed", err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


app.get('/toggle', async (req, res) => {
  const ip = req.query.ip
  const plug = plugs.find(p => p.ip === ip)
  if (!plug) return res.status(404).send('Plug not found')
  console.log('toggle plug ', ip)
  try {
    await axios.get(`http://${plug.ip}/cm?cmnd=Power%20TOGGLE`)
    res.send(`
      <html>
        <body>
          <p>Toggled ${plug.name}</p>
          <script>setTimeout(() => window.close(), 500)</script>
        </body>
      </html>
    `)
  } catch {
    res.status(500).send('Toggle failed')
  }
})

app.listen(port)
