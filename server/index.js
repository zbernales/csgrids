const express = require('express')
const { HLTV } = require('hltv')
const fs = require('fs');
const grids = JSON.parse(fs.readFileSync("resources/grids.json", "utf8"));
const convert = require('./resources/frontendGridParser');
const app = express()
const playerRoutes = require('./routes/playerRoutes')
const cors = require('cors')
let today = new Date().toISOString().split("T")[0];
let selectedDate = today;

app.use(cors())
app.use(express.json())
app.use('/api/player', playerRoutes);


app.get('/client-array', async (req, res) => {
  const { date } = req.query; // use the date sent from frontend
  const statArray = grids.find(item => item.Date === date); 
  const clientArray = await convert(statArray);
  res.json(clientArray);
});

app.post('/selected-date', async (req, res) => {
  selectedDate = req.body.date;
  res.status(200).json({ message: 'Date updated' });
})
app.post('/api/player', (req, res) => {
    const { gridIndex, playerName } = req.body;
    console.log(`Receivesfsdfd data: Grid Index: ${gridIndex}, Player Name: ${playerName}`);
    // Process the data as needed, e.g., saving to a database
    
    // Send a response back to the client
    res.status(200).json({ message: 'Player data receiasdfadfved successfully!' });
  });

app.listen(3001, () => {
    console.log("Serving running on port 3001");
})

/*HLTV.getPlayer({ id: 7592 }).then((player) => {
    console.log(player);
  });*/