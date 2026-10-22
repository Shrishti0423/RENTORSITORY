import {
  Armchair,
  Bike,
  BookOpen,
  Shirt,
  CookingPot,
  LayoutGrid,
  Monitor,
  TentTree,
  Wrench,
} from 'lucide-react'

const categories = [
  { name: 'All items', icon: LayoutGrid },
  { name: 'Books', icon: BookOpen },
  { name: 'Study Material', icon: BookOpen },
  { name: 'Furniture', icon: Armchair },
  { name: 'Electronics', icon: Monitor },
  { name: 'Cycles and Bikes', icon: Bike },
  { name: 'Clothing', icon: Shirt },
  { name: 'Home and Kitchen', icon: CookingPot },
  { name: 'Sports and Trekking', icon: TentTree },
  { name: 'Other', icon: Wrench },
]

function CategorySection({ selectedCategory, onSelect }) {
  return (
    <section aria-labelledby="categories-title">
      <div className="mb-5">
        <p className="text-sm font-semibold text-indigo-600">Find your thing</p>
        <h2 id="categories-title" className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
          Browse by category
        </h2>
      </div>

      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-3">
        {categories.map(({ name, icon: Icon }) => {
          const isSelected = selectedCategory === name

          return (
            <button
              key={name}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(isSelected && name !== 'All items' ? 'All items' : name)}
              className={`flex min-w-28 shrink-0 flex-col items-center gap-2 rounded-2xl border px-4 py-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-700'
              }`}
            >
              <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
              {name}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategorySection
