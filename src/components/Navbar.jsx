import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { MapPin, Menu, Search, X } from 'lucide-react'

function Navbar({ searchValue = '', onSearch = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
  }

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-indigo-600 ${
      isActive ? 'text-indigo-600' : 'text-slate-700'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-[0_2px_12px_rgb(15_23_42/3%)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-slate-900 transition-transform duration-200 hover:scale-[1.02]"
          aria-label="Rental Marketplace home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-sm shadow-indigo-200">
            R
          </span>
          <span>rent<span className="text-indigo-600">able</span></span>
        </Link>

        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 sm:px-3 sm:text-sm"
          aria-label="Marketplace city: Dehradun"
        >
          <MapPin size={15} aria-hidden="true" />
          Dehradun
        </span>

        <form
          onSubmit={handleSubmit}
          role="search"
          className="hidden min-w-48 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition-colors duration-200 focus-within:border-indigo-400 focus-within:bg-white md:flex"
        >
          <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search Dehradun listings"
            aria-label="Search Dehradun listings"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </form>

        <nav className="ml-auto hidden items-center gap-6 md:flex" aria-label="Main navigation">
          <NavLink to="/" end className={navClass}>Explore</NavLink>
          <NavLink to="/list-item" className={navClass}>List an Item</NavLink>
          <NavLink
            to="/login"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
          >
            Log in
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="ml-auto rounded-lg p-2 text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 md:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 md:hidden">
          <form onSubmit={handleSubmit} role="search" className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search Dehradun listings"
              aria-label="Search Dehradun listings"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </form>
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <NavLink to="/" end className={({ isActive }) => `${navClass({ isActive })} rounded-lg px-3 py-2`} onClick={() => setMenuOpen(false)}>
              Explore
            </NavLink>
            <NavLink to="/list-item" className={({ isActive }) => `${navClass({ isActive })} rounded-lg px-3 py-2`} onClick={() => setMenuOpen(false)}>
              List an Item
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => `${navClass({ isActive })} rounded-lg px-3 py-2`} onClick={() => setMenuOpen(false)}>
              Log in
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
