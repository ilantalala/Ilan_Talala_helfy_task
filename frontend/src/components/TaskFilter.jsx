import '../styles/TaskFilter.css'

const FILTERS = ['all', 'completed', 'pending']

function TaskFilter({ activeFilter, onChange }) {
  return (
    <div className="task-filter">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          className={filter === activeFilter ? 'filter-button active' : 'filter-button'}
          onClick={() => onChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default TaskFilter
