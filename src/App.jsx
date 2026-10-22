import { useState } from 'react'
import { Outlet, Route, Routes } from 'react-router'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import ItemDetails from './pages/ItemDetails.jsx'
import ListItem from './pages/ListItem.jsx'

function SiteLayout() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <>
      <Navbar searchValue={searchValue} onSearch={setSearchValue} />
      <Outlet context={{ searchValue, setSearchValue }} />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="list-item" element={<ListItem />} />
        <Route path="items/:id" element={<ItemDetails />} />
      </Route>
    </Routes>
  )
}

export default App
