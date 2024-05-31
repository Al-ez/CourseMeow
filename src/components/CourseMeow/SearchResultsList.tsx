import React from 'react'
import Select from 'react-select';
import './SearchResultsList.css';
import { useState, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';
import { MdOutlineDelete } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md";

interface SearchResultsListProps {
    results: any[]; 
    moduleCodes: any[]; // array of strings for module code. User's mods
    timetable: any[];
    email: any;
    authToken: string;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({results, moduleCodes, timetable, email, authToken}) => {

  const [selectedMods, setSelectedMods] = useState<any[]>([]); 
  const [lessonList, setLessonList] = useState<any[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<any[]>([]);
  const [semester, setSemester] = useState(0);
  const [currentCode, setCurrentCode] = useState('');

  const test = timetable.toString();
  console.log(test);
  useEffect(() => {
    const fetchMods = async () => {
      const mods: any[] = [];
      for (const code of moduleCodes) {
        const response = await fetch("./ModuleListSummarised.json");
        const json = await response.json();
        const mod = json.find((course: any) => code === course.moduleCode);
        if (mod) {
          mods.push(mod);
        }
      }
      setSelectedMods(mods);
    };
    fetchMods();
  }, [moduleCodes]);

  
  useEffect(() => {
    const fetchLessons = async () => {
      const classList: any[] = [];
      const flatTimetable = timetable.reduce((acc, curr) => acc.concat(curr), []);
      for (const lesson of flatTimetable) {
        const sem = lesson.semester.toString();
        const response = await fetch('http://localhost:8080/modules/' + sem + '/' + lesson.code + '/get');
        const json = await response.json();
        const lsn = json.find((item: any) => 
          item.code === lesson.code && item.classNo === lesson.classNo);
        if (lsn) {
          classList.push(lsn);
        }
      }
      setSelectedLessons(classList);
    };
    fetchLessons();
  }, [timetable]);
  


  const handleModuleClick = async (mod: any) => { // add mod
    if (selectedMods.length < 10  && !selectedMods.some((existing) => existing.moduleCode === mod.moduleCode)) {
      setSelectedMods([...selectedMods, mod]); // add on frontend
      // now add on backend
      const addedmod = mod.moduleCode;
      await fetch('http://localhost:8080/modules/' + addedmod + '/add/username=' + email + '&token=' + authToken);
    }
  }

  const handleDeleteMod = async (moduleCode: any) => { // delete mod
    setSelectedMods(selectedMods => selectedMods.filter(mod => mod.moduleCode !== moduleCode));
    const lessonsToDelete = selectedLessons.filter(lesson => lesson.code === moduleCode);
    setSelectedLessons(selectedLessons.filter(lesson => lesson.code !== moduleCode));

    for (const lesson of lessonsToDelete) {
      await handleDeleteLesson2(lesson);
    }
    
    await fetch('http://localhost:8080/modules/' + moduleCode + '/delete/username=' + email + '&token=' + authToken);

  }
  
  const handleAddLesson = async (moduleCode: any, sem: any) => { // when click add-lesson button    
    if (lessonList.length===0) {
      const response = await fetch('http://localhost:8080/modules/'+ sem +'/' + moduleCode + '/get');
      const data = await response.json(); // array of lessons
      setLessonList(data);
      setSemester(sem);
      setCurrentCode(moduleCode);
    } else {
      setLessonList([]);
      setCurrentCode('');
    }

  }

  const handleLessonClick = async (lesson: any) => { // when selecting a lesson from dropdown
    if (!selectedLessons.some((existing) => existing === lesson)) {
    setSelectedLessons([...selectedLessons, lesson]); // update on frontend
    // update on backend
    await fetch('http://localhost:8080/timetable/' + currentCode + '/lessons/add/semester=' + semester + '&classNo=' + lesson.classNo + '/username=' + email + '&token=' + authToken);
    }
  }

  const handleDeleteLesson2 = async (lesson: any) => { // delete on backend only
    const sem = lesson.semester.toString();
    await fetch('http://localhost:8080/timetable/' + lesson.code + '/lessons/delete/semester=' + sem + '&classNo=' + lesson.classNo + '/username=' + email + '&token=' + authToken);
  }

  const handleDeleteLesson = async (lesson: any) => { // delete lesson from frontend and backend
    
    setSelectedLessons(selectedLessons.filter((item) => !(
      item.lessonType === lesson.lessonType && 
      item.classNo === lesson.classNo &&
      item.startTime === lesson.startTime &&
      item.endTime === lesson.endTime &&
      item.venue === lesson.venue &&
      item.day === lesson.day)
    ))  // delete on frontend

    const sem = lesson.semester.toString();
    // now delete on backend
    await fetch('http://localhost:8080/timetable/' + lesson.code + '/lessons/delete/semester=' + sem + '&classNo=' + lesson.classNo + '/username=' + email + '&token=' + authToken);
  }

  return (
    <div>
      <div className='results-list'>
          {
            results.map((result, id) => {
              return <button key={id} className='result' onClick={() => handleModuleClick(result)}>
                {result.moduleCode + " " + result.title}
              </button>
            })
          }    
      </div>
      <div className='mods-list'>
        <h3>Course List:</h3>
        <ul>
          {selectedMods.map((mod, id) => (
            <li key={id} className='selected-mod'>
              <div className='mod'>{mod.moduleCode} {mod.title}</div>
              <MdOutlineDelete className='delete-mod' onClick={() => handleDeleteMod(mod.moduleCode)} />
              <MdAddCircleOutline className='add-lesson-0' onClick={() => handleAddLesson(mod.moduleCode, 0)} /> 
              <MdAddCircleOutline className='add-lesson-1' onClick={() => handleAddLesson(mod.moduleCode, 1)} /> 
            </li>
          ))}      
        </ul>
      </div>
      <h3 className='semesters'>Sem1 Sem2</h3>
      <div className='lessons-area'>
        <h3 className='lesson-list-header'>Lesson List:</h3>
        <div className='lesson-list'>
        {
          lessonList.map((lesson, id) => {
            return <button key={id} className='lesson' onClick={() => handleLessonClick(lesson)}>
              { lesson.lessonType + " " 
              + lesson.classNo + " " 
              + lesson.day + " "
              + lesson.startTime + "-"
              + lesson.endTime}
            </button>
          })
        }
        </div>
      </div>
      <div className='selected-lessons'>
        <h3>Selected Lessons:</h3>
        <ul>
          {selectedLessons.map((lesson, id) => (
            <li key={id} className='selected-lesson-list'>
              <div className='selected-lesson'>
                { lesson.code + " "
              + lesson.lessonType + " " 
              + lesson.classNo + " " 
              + lesson.day + " "
              + lesson.startTime + "-"
              + lesson.endTime}
              </div>
              <MdOutlineDelete className='delete-lesson' onClick={() => handleDeleteLesson(lesson)} /> 
            </li>
          ))}      
        </ul>
      </div>
    </div>
  )
}

