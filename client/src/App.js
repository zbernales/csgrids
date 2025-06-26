import './App.css';
import axios from 'axios';
import {useEffect} from 'react';
import {useState} from 'react';
import { useRef } from 'react';
//import logo from './Counter-Strike_2_29.webp'
import SearchBar from "./components/SearchBar"

function App() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  //const [clickedGridIndex, setClickedGridIndex] = useState(null);
  const [row, setRow] = useState(null);
  const [column, setCol] = useState(null);
  const searchRef = useRef(null);
  const handleComponentClick = (row, column) => {
    //setClickedGridIndex(index);
    setRow(row);
    setCol(column);
    setIsSearchVisible(true);
  };

  // Hide search bar when clicking outside
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearchVisible(false);
      //setClickedGridIndex(null);
      setRow(null);
      setCol(null);
    }
  };

  const handlePlayerSelect = (selectedPlayer) => {
    if (row !== null && column != null) {
      // Make a request to your backend
      axios.post('http://localhost:3001/api/player', {
        rowIndex: row,
        colIndex: column,
       // gridIndex: clickedGridIndex, // Send which grid was clicked
        playerName: selectedPlayer   // Send selected player name
      }).then(response => {
        console.log('Player data sent successfully:', response.data);
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
          <div />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTMEq76bpggxzaf1aukuPDGlb7EJv0vi6v0Q&s" alt="Team Liquid" className="logo"></img>
            <img src="https://cdn.escharts.com/uploads/public/608/7e9/9f8/6087e99f88f73113046300.png" alt="Faze Clan" className="logo"></img>
            <div className="stat">1.4+ HLTV rating in S-tier tournament</div>
            <img src="https://upload.wikimedia.org/wikipedia/en/a/ab/Luminosity_Gaming_logo.svg" alt="Luminosity Gaming" className="logo"></img>
            <div className="square" onClick={() => handleComponentClick(0, 0)}></div>
            <div className="square" onClick={() => handleComponentClick(0, 1)}></div>
            <div className="square" onClick={() => handleComponentClick(0, 2)}></div>
            <div className="stat">HLTV top 20</div>
            <div className="square" onClick={() => handleComponentClick(1, 0)}></div>
            <div className="square" onClick={() => handleComponentClick(1, 1)}></div>
            <div className="square" onClick={() => handleComponentClick(1, 2)}></div>
            <div className="stat">European</div>
            <div className="square" onClick={() => handleComponentClick(2, 0)}></div>
            <div className="square" onClick={() => handleComponentClick(2, 1)}></div>
            <div className="square" onClick={() => handleComponentClick(2, 2)}></div>
        </div>
      </div>

      <footer className="footer">
        <p>Created by zbernales on GitHub</p>
      </footer>
    </div>
  );
}

export default App;
