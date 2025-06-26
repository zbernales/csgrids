import React, { useState, useEffect } from 'react';
import "./SearchBar.css";

function SearchBar({ placeholder, onPlayerSelect }) {
    const [playerNames, setPlayerNames] = useState([]); // Store all player names
    const [filteredData, setFilteredData] = useState([]); // Store filtered names
    const [searchTerm, setSearchTerm] = useState(""); // Search input value

    // Function to handle search input changes
    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setSearchTerm(searchWord); // Update search term state

        // Filter the player names based on the search term
        const newFilter = playerNames.filter((value) => {
            return value.toLowerCase().includes(searchWord.toLowerCase());
        });

        setFilteredData(newFilter); // Update the filtered data state
    };

    const handleSelect = (playerName) => {
        if (onPlayerSelect) {
            onPlayerSelect(playerName);
            setFilteredData([]);
        }
        //console.log('Selected player:', playerName);
        // Perform any action here, e.g., set a state, navigate, etc.
        //alert(`You selected: ${playerName}`);
    };

    // Fetch player names from the local text file when the component mounts
    useEffect(() => {
        fetch("/csplayers.txt") // Assumes the file is in the public folder
            .then(response => response.text())
            .then(text => {
                // Split the text file content by new lines to get each player name
                const names = text.split("\n").map(name => name.trim());
                setPlayerNames(names); // Set the player names to state
                setFilteredData(names); // Initially display all player names
            })
            .catch(error => {
                console.error("Error loading player names:", error);
            });
    }, []);

    return (
        <div className="search">
            <div className="searchInputs">
                <input 
                    type="text" 
                    placeholder={placeholder} 
                    value={searchTerm} // Bind input to searchTerm
                    onChange={handleFilter} // Update filter on change
                />
            </div>
            {filteredData.length !== 0 && (
                <div className="dataResult">
                    {filteredData.map((value, key) => {
                        return  (
                        <a key={key}
                        className="dataItem"
                        onClick={() => handleSelect(value)}>{value}</a> 
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SearchBar;