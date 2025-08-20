import './App.css';
import axios from 'axios';
import {useEffect} from 'react';
import {useState} from 'react';
import { useRef } from 'react';
//import logo from './Counter-Strike_2_29.webp'
import SearchBar from "./components/SearchBar"
import CustomAlert from "./components/CustomAlert";

function App() {
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [row, setRow] = useState(null);
  const [column, setCol] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const searchRef = useRef(null);
  const handleComponentClick = (row, column) => {
    setRow(row);
    setCol(column);
    setIsSearchVisible(true);
  };

  // Hide search bar when clicking outside
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearchVisible(false);
      setRow(null);
      setCol(null);
    }
  };

  const handlePlayerSelect = (selectedPlayer) => {
    if (row !== null && column != null && !Object.values(selectedPlayers).some(player => player?.name === selectedPlayer)) {
      axios.post('http://localhost:3001/api/player', {
        rowIndex: row,
        colIndex: column,
        playerName: selectedPlayer  
      }).then(response => {
        console.log('Player data sent successfully:', response.data);
        const playerData = response.data.data;
        const newSelectedPlayers = {
          ...selectedPlayers,
          [`${row}-${column}`]: {
            name: playerData.playerName,
            image: playerData.image
          }
        };
        setSelectedPlayers(newSelectedPlayers);
        if (Object.keys(newSelectedPlayers).length == 9) {
          setAlertVisible(true);
        }
      }).catch(error => {
        console.error('Error sending player data:', error);
      });
    }
  };

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 
  return (
    <div className="App">
      <header className="header">
        <h1>csgrids.com</h1>
      </header>  
      <div className="content-wrapper">
      {isSearchVisible && (
          <div ref={searchRef}>
            <SearchBar 
              placeholder="Enter a Player"
              onPlayerSelect={handlePlayerSelect}
            />
          </div>
        )} 
        <div className="grid-container">
          {alertVisible && (
            <CustomAlert
              visible={alertVisible}
              onClose={() => setAlertVisible(false)}
              message="Grid Completed!"
            />
          )}
          <div />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTMEq76bpggxzaf1aukuPDGlb7EJv0vi6v0Q&s" alt="Team Liquid" className="logo"></img>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/Faze_Clan.svg" alt="Faze Clan" className="logo"></img>
            <div className="stat">1.0+ HLTV rating</div>
            <img src="https://upload.wikimedia.org/wikipedia/en/a/ab/Luminosity_Gaming_logo.svg" alt="Luminosity Gaming" className="logo"></img>
            <div className="square" onClick={() => handleComponentClick(0, 0)}>
              {selectedPlayers["0-0"] && (
                <>
                  <img 
                    src={selectedPlayers["0-0"].image} 
                    alt="https://www.seekpng.com/ipng/u2e6w7t4r5i1i1e6_default-portrait-image-generic-profile/" 
                    className="player-pic"
                  />
                  <div className="nametag">{selectedPlayers["0-0"].name}</div>
                </>
               )}
            </div>
            <div className="square" onClick={() => handleComponentClick(0, 1)}>
              {selectedPlayers["0-1"] && (
                <>
                  <img 
                    src={selectedPlayers["0-1"].image} 
                    alt={selectedPlayers["0-1"].name} 
                    className="player-pic"
                  />
                  <div className="nametag">{selectedPlayers["0-1"].name}</div>
                </>
              )}
            </div>
            <div className="square" onClick={() => handleComponentClick(0, 2)}>
              {selectedPlayers["0-2"] && (
                <>
                  <img 
                    src={selectedPlayers["0-2"].image} 
                    alt={selectedPlayers["0-2"].name} 
                    className="player-pic"
                  />
                  <div className="nametag">{selectedPlayers["0-2"].name}</div>
                </>
              )}
            </div>
            <div className="stat">Major Winner</div>
            <div className="square" onClick={() => handleComponentClick(1, 0)}>
              {selectedPlayers["1-0"] && (
                <>
                  <img 
                    src={selectedPlayers["1-0"].image} 
                    alt={selectedPlayers["1-0"].name} 
                    className="player-pic"
                  />
                  <div className="nametag">{selectedPlayers["1-0"].name}</div>
                </>
              )}
            </div>
            <div className="square" onClick={() => handleComponentClick(1, 1)}>
              {selectedPlayers["1-1"] && (
                <>
                  <img 
                    src={selectedPlayers["1-1"].image} 
                    alt={selectedPlayers["1-1"].name} 
                    className="player-pic"
                  />
                  <div className="nametag">{selectedPlayers["1-1"].name}</div>
                </>
              )}
            </div>
            <div className="square" onClick={() => handleComponentClick(1, 2)}>
              {selectedPlayers["1-2"] && (
                <>
                  <img 
                    src={selectedPlayers["1-2"].image} 
                    alt={selectedPlayers["1-2"].name} 
                    className="player-pic"
                  />
                  <div className="nametag">{selectedPlayers["1-2"].name}</div>
                </>
              )}
            </div>
            <div className="stat">European</div>
            <div className="square" onClick={() => handleComponentClick(2, 0)}>
              {selectedPlayers["2-0"] && (
                <>
                  <img 
                    src={selectedPlayers["2-0"].image} 
                    alt={selectedPlayers["2-0"].name} 
                    className="player-pic"
                  />
                  <div className="nametag">{selectedPlayers["2-0"].name}</div>
                </>
              )}
            </div>
            <div className="square" onClick={() => handleComponentClick(2, 1)}>
              {selectedPlayers["2-1"] && (
                <>
                  <img 
                    src={selectedPlayers["2-1"].image} 
                    alt={selectedPlayers["2-1"].name} 
                    className="player-pic"
                  />
                  <div className="nametag">{selectedPlayers["2-1"].name}</div>
                </>
              )}
            </div>
            <div className="square" onClick={() => handleComponentClick(2, 2)}>
              {selectedPlayers["2-2"] && (
                <>
                  <img 
                    src={selectedPlayers["2-2"].image} 
                    alt={selectedPlayers["2-2"].name} 
                    className="player-pic"
                  />
                  <div className="nametag">{selectedPlayers["2-2"].name}</div>
                </>
              )}
            </div>
        </div>
      </div>

      <footer className="footer">
        <p>Created by zbernales on GitHub</p>
      </footer>
    </div>
  );
}

export default App;
