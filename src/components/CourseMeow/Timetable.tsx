import './Timetable.css';
import Fullcalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import cat_icon from '../assets/CourseMeow.png'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from "./SearchBar";
import useLocalStorage from "use-local-storage";
import { SearchResultsList } from './SearchResultsList';
import { useLocation } from 'react-router-dom';

 


const Timetable: React.FC = () => {
    function handleLogout() {
        return navigate("/");
    }

    function handleMode() {
        return mode? setMode(false) : setMode(true);
    }

    const fetchMods = async () => {        
        const response = await fetch('http://localhost:8080/modules/username=' + email + '&token=' + authToken);
        // change url to 'http://localhost:8080/modules/username=admin@test.com&token=' + authToken, since 
        // authToken is a string
        const data = await response.json();
        setModuleCodes(data)
        const test = data.toString();
        console.log(test);
    }

    const fetchTimetable = async () => {
        const response = await fetch('http://localhost:8080/timetable/username=' + email + '&token=' + authToken);
        const data = await response.json();
        setTimetable(data);
        let test = data.toString();        
        console.log(data);
    }

    const location = useLocation();
    const authToken = location.state?.authToken; // user token (string)
    const email = location.state?.email; // user email 
    const navigate = useNavigate();

    const [timetable, setTimetable] = useState<any[]>([]);
    const [moduleCodes, setModuleCodes] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [mode, setMode] = useLocalStorage("mode", false);

    useEffect (() => {
        fetchMods();
    }, []);

    useEffect (() => {
        fetchTimetable();
    }, []);
    
    return (
        <div className='page' data-theme={mode? "light" : "dark"}>
            <div className='top'>
                <img src={cat_icon} alt="" className='cat-icon'/>
                <h1>Welcome to CourseMeow!</h1>
                <button className={mode? 'darkmode' : 'lightmode'} onClick={handleMode}>Dark Mode</button>
                <button className='logout' onClick={handleLogout}>Logout</button>                
            </div>
            <div className={mode? 'timetable-light' : 'timetable-dark'}>
                <Fullcalendar
                    plugins={[timeGridPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={false}
                    weekends={false} // Hide weekends
                    firstDay={1} // Start from Monday
                    allDaySlot={false} // Hide the all-day slot
                    slotMinTime="08:00:00" // Start time of the timetable
                    slotMaxTime="20:00:00" // End time of the timetable
                    slotDuration='01:00:00' // Set slot duration to 1 hour
                    slotLabelInterval='01:00:00' // Set slot label interval to 1 hour
                    dayHeaderFormat={{ weekday: 'short' }} // Display full weekday names
                    height='1180px'                    
                />
            </div>
            <div className='bottom'>   
                <div className='search-bar-container'>
                    <SearchBar setResults={setResults} />
                    <SearchResultsList 
                        results={results} 
                        moduleCodes={moduleCodes} 
                        timetable={timetable}
                        email={email}
                        authToken={authToken}
                    />
                </div>
            </div>
        </div>
    )
}

export default Timetable;