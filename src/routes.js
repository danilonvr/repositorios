import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Main from './pages/Main'
import Repositorio from './pages/Repositorio'


export default function MainRoutes(){
    return(
    <Routes>
        <Route path='' element={<Main />} />
        <Route path='repositorio' element={<Repositorio />}>
            <Route path=':repositorio'/>
        </Route>
            
    </Routes>
)
}