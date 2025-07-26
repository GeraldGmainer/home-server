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

    const promQuery = 'tasmota_status_sns_energy_power{job="tasmota"}'
    const promResp = await axios.get(`http://192.168.178.10:9090/api/v1/query?query=${encodeURIComponent(promQuery)}`)
    const promResults = promResp.data?.data?.result || []

    const wattMap = {}
    for (const r of promResults) {
      const source = r.metric.source
      wattMap[source] = parseFloat(r.value[1])
    }

    const results = plugs.map((plug) => {
      const watt = wattMap[plug.prom_source] || 0
      return {
        name: plug.name,
        state: watt > 0 ? 'ON' : 'OFF',
        url: `http://${plug.ip}/`,
        ip: plug.ip,
        watt
      }
    })

    res.json(results)
    console.log("Fetched plug status from Prometheus")
  } catch (err) {
    console.error("Prometheus status failed", err)
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
