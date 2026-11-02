import React from 'react';
import {createRoot} from 'react-dom/client';
import './globals.css';
import Invitation from './invitation';
createRoot(document.getElementById('root')!).render(<Invitation rsvpPage={new URLSearchParams(location.search).get('page')==='rsvp'}/>);
