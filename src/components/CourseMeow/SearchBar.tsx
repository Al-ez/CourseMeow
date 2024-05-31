import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { useState } from "react";
import { json } from "react-router-dom";

interface SearchBarProps {
    setResults: (results: any[]) => void; // Adjust the type of the results array as necessary
}

export const SearchBar: React.FC<SearchBarProps> = ({ setResults }) => {
    const [input, setInput] = useState("");

    const fetchData = (value: string) => {
        fetch("./ModuleListSummarised.json")
        .then((response) => response.json()) // parse into json
        .then(json => {
            const results = json.filter((course: any) => {
                return value && course && course.moduleCode && course.moduleCode.toLowerCase().includes(value)
            })
            setResults(results);
        });
    }

    const handleChange = (value: string) => {
        setInput(value);
        fetchData(value);
    }

    return  (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input className="searchbar-text" placeholder="Add course to timetable" 
            value={input} 
            onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    )
}

export default SearchBar;