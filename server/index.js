const express = require('express')
const { HLTV } = require('hltv')
const fs = require('fs');
const { setSelectedDate } = require('./states/dateStore')
const grids = JSON.parse(fs.readFileSync("resources/grids.json", "utf8"));
const convert = require('./resources/frontendGridParser');
const app = express()
const playerRoutes = require('./routes/playerRoutes')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use('/api/player', playerRoutes);

app.get('/client-array', async (req, res) => {
  const { date } = req.query; // use the date sent from frontend
  setSelectedDate(date);
  const statArray = grids.find(item => item.Date === date) || grids[0];
  const clientArray = await convert(statArray);
  res.json(clientArray);
});

app.post('/selected-date', async (req, res) => {
  setSelectedDate(req.body.date);
  res.status(200).json({ message: 'Date updated' });
})

app.listen(3001, () => {
    console.log("Serving running on port 3001");
})

  