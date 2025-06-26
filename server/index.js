const express = require('express')
const { HLTV } = require('hltv')
const app = express()
const playerRoutes = require('./routes/playerRoutes')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use('/api/player', playerRoutes);


const players = [
    { id: 7998, name: 's1mple' },
    { id: 7592, name: 'dev1ce' },
    { id: 11893, name: 'ZywOo' },
    // Add more players as needed
];

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