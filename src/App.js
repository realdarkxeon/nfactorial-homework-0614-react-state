import {useState} from "react";
import "./App.css";
import {v4 as myNewID} from "uuid";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

function App() {
  if(!localStorage["todolist"]) {
    localStorage.setItem("todolist", JSON.stringify([
      {
        key: 1,
        label: "Have fun",
      },
      {
        key: 2,
        label: "Spread Empathy",
      },
      {
        key: 3,
        label: "Generate Value",
      }
    ]));
  }

  const [itemToDo, setItemToDo] = useState("");
  const [items, setItems] = useState(JSON.parse(localStorage["todolist"]));

  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  const handleToDoChange = (event) => {
    setItemToDo(event.target.value);
  };

  const handleAddItem = () => {
    const newItem = {
      key: myNewID(),
      label: itemToDo,
    };

    setItems((prevItem) => [newItem, ...prevItem]);
    setItemToDo("");
  };

  const handleItemDeletion = ({key}) => {
    const newArray = items.filter((item) => item.key !== key);
    localStorage.removeItem(key);
    setItems(newArray);
  }

  const handleItemDone = ({key}) => {
    // const findIndex = items.findIndex((item) => item.key === key);
    // const leftSide = items.slice(0, findIndex+1);
    // const rightSide = items.slice(findIndex+1, items.length);
    // const oldItem = items[findIndex];
    // const newItem = {...oldItem, done: !oldItem.done};
    // setItems([...leftSide, newItem, ...rightSide]);

    setItems((prevItems) => 
      prevItems.map((item) => {
        if(item.key === key) {
          return {...item, done: !item.done};
        }
        else return item;
      })
    );
  };

  const handleItemImportant = ({key}) => {
    setItems((prevItems) => 
      prevItems.map((item) => {
        if(item.key === key) {
          return {...item, important: !item.important};
        }
        else {
          return item;
        }
      }) 
    );
  };

  const handleFilterChange = ({type}) => {
    setFilterType(type);
  };

  const moreToDo = items.filter((item) => !item.done).length;
  const doneToDo = items.length - moreToDo;
  const filteredArray = filterType === "all" ? items : filterType === "done" ? items.filter((item) => item.done) : items.filter((item) => !item.done);
  // items.filter((item) => item.type)

  localStorage.setItem("todolist", JSON.stringify(items));

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>{moreToDo} more to do, {doneToDo} done</h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="Type to search"
          onChange={(event) => setSearch(event.target.value)}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button key={item.type} type="button" className={`btn btn-info ${filterType === item.type ? "" : "btn-outline-info"}`} onClick={() => handleFilterChange(item)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredArray.filter(item => item.label.includes(search)).length > 0 && filteredArray.filter(item => item.label.includes(search)).map((item) => (
          <li key={item.key} className="list-group-item">
            <span className={`todo-list-item ${item.done?"done":""} ${item.important?"important":""}`}>
              <span className="todo-list-item-label" onClick={() => handleItemDone(item)}>{item.label}</span>

              <button
                type="button"
                className="btn btn-outline-success btn-sm float-right"
                onClick={() => handleItemImportant(item)}
              >
                <i className="fa fa-exclamation" />
              </button>

              <button
                type="button"
                className="btn btn-outline-danger btn-sm float-right"
                onClick={() => handleItemDeletion(item)}
              >
                <i className="fa fa-trash-o" />
              </button>
            </span>
          </li>
        ))}
      </ul>

      <div className="item-add-form d-flex">
        <input
          value={itemToDo}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleToDoChange}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>Add item</button>
      </div>
    </div>
  );
}

export default App;
