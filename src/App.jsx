import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FiSearch } from "react-icons/fi";

function App() {
  const [todo, settodo] = useState(""); // State for the current input value of a new todo
  const [todos, settodos] = useState([]); // State for the list of todos
  const [showFinished, setshowFinished] = useState(true); // State to show/hide completed todos
  const [search, setsearch] = useState(""); // State for search input
  const [expandedTodo, setexpandedTodo] = useState(null); // State to manage expanded todo
  const [showFeedback, setShowFeedback] = useState(false); // State for feedback message visibility
  const [hasAttemptedToAdd, setHasAttemptedToAdd] = useState(false); // State to track if adding was attempted

  useEffect(() => {
    fetch('/todos.json') // Fetch todos from JSON file
      .then(response => response.json())
      .then(data => settodos(data)); // Update todos state with fetched data
  }, []);

  const handleAdd = () => {
    setHasAttemptedToAdd(true); // Track that an attempt to add a todo has been made
    if (todo.length <= 3) { // Validate todo length
      setShowFeedback(true); // Show feedback if length is insufficient
      return;
    }
    const date = new Date().toISOString(); 
    const newTodo = {
      id: uuidv4(), // Generate a unique ID for the new todo
      todo,
      description: "",
      date,
      isCompleted: false
    };
    settodos([...todos, newTodo]); // Add the new todo to the list
    settodo(""); // Clear the input field
    setShowFeedback(false); // Hide feedback message
  };

  const handleEdit = (e, id) => {
    let t = todos.find(i => i.id === id); // Find the todo to be edited
    settodo(t.todo); // Set the current todo input to the todo being edited
    let newtodos = todos.filter(items => items.id !== id); // Remove the edited todo from the list
    settodos(newtodos); // Update todos state
  };

  const handleDelete = (e, id) => {
    let newtodos = todos.filter(items => items.id !== id); // Filter out the todo to be deleted
    settodos(newtodos); // Update todos state
  };

  const handleCheckbox = (e) => {
    let id = e.target.name; // Get the ID of the todo to be toggled
    let index = todos.findIndex(items => items.id === id); // Find the index of the todo
    let newtodos = [...todos];
    newtodos[index].isCompleted = !newtodos[index].isCompleted; // Toggle the isCompleted status
    settodos(newtodos); // Update todos state
  };

  const handleChange = (e) => {
    settodo(e.target.value); // Update todo input state
  };

  const toggleFinish = (e) => {
    setshowFinished(!showFinished); // Toggle visibility of completed todos
  };

  const handleSearchChange = (e) => {
    setsearch(e.target.value); // Update search input state
  };

  const toggleExpand = (id) => {
    setexpandedTodo(expandedTodo === id ? null : id); // Toggle expansion of the selected todo
  };

  const filteredTodos = todos.filter(item => item.todo.toLowerCase().includes(search.toLowerCase())); // Filter todos based on search input

  return (
    <>
      <Navbar /> {/* Render the navigation bar */}
      <div className="flex flex-col md:flex-row bg-cream-100 h-full">
        
        <div className="container md:w-2/3 mx-auto bg-cream-50 my-5 rounded-xl p-5 shadow-lg">
          <h1 className='font-bold text-center text-2xl text-teal-800 mb-4'>Todo List</h1>
          
          <div className="search flex justify-center mb-4">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search..."
              className='w-full md:w-1/2 rounded-lg px-4 py-2 border border-gray-300 shadow-sm'
            />
            <button
              onClick={() => setsearch('')} // Clear search input
              className='ml-2 bg-teal-600 hover:bg-teal-700 text-white p-2 px-4 rounded-md flex items-center'
            >
              <FiSearch />
            </button>
          </div>

          <div className="addTodo flex flex-col gap-4 mb-4">
            <h2 className="text-2xl font-bold text-teal-600 text-center">Add a Todo</h2>
            <div className="bar flex">
              <input onChange={handleChange} value={todo} type="text" placeholder='Add your Todos...' className='w-full rounded-lg px-4 py-2 border border-gray-300'/>
              <button
                onClick={handleAdd} // Add the new todo
                className='bg-teal-600 hover:bg-teal-700 text-white p-2 px-4 rounded-md ml-2'
              >
                +
              </button>
            </div>
            {hasAttemptedToAdd && showFeedback && <div className='text-red-600 text-sm text-center'>Todo length should be at least 3 characters.</div>}
          </div>
          
          <div className="flex items-center my-4">
            <input
              onChange={toggleFinish}
              type="checkbox"
              checked={showFinished}
              className='mr-2'
            />
            <label className='text-teal-600'>Show Finished</label>
          </div>

          <h2 className='font-bold text-xl text-teal-700 mb-4'>Todos</h2>
          <div className="todos">
            {filteredTodos.length === 0 && <div className='m-5 text-gray-600'>You have no tasks</div>}
            {filteredTodos.map(items => (
              (!showFinished || items.isCompleted) && (
                <div key={items.id} className="todo w-full my-4 p-3 bg-white rounded-lg shadow-md">
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                      <input
                        onChange={handleCheckbox}
                        type="checkbox"
                        checked={items.isCompleted}
                        name={items.id}
                      />
                      <div className={`text-lg ${items.isCompleted ? "line-through text-gray-500" : "text-gray-800"}`}>
                        {items.todo}
                      </div>
                    </div>
                    <div className="buttons flex items-center gap-2">
                      <button
                        onClick={(e) => handleEdit(e, items.id)} // Edit the todo
                        className='bg-teal-600 hover:bg-teal-700 text-white p-2 px-3 rounded-md'
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, items.id)} // Delete the todo
                        className='bg-teal-600 hover:bg-teal-700 text-white p-2 px-3 rounded-md'
                      >
                        <MdDelete />
                      </button>
                      <button
                        onClick={() => toggleExpand(items.id)} // Expand or collapse the todo details
                        className='bg-teal-600 hover:bg-teal-700 text-white p-2 px-3 rounded-md'
                      >
                        {expandedTodo === items.id ? "Collapse" : "Expand"}
                      </button>
                    </div>
                  </div>
                  {expandedTodo === items.id && (
                    <div className='mt-4'>
                      <div className='text-gray-600'>Description: {items.description}</div>
                      <div className='text-gray-600'>Last Updated: {new Date(items.date).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
