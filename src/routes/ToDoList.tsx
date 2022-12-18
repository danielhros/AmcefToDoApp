import React, { useState } from "react";
import ToDoItem from "../components/ToDoItem";
import { ToDoItem as ToDoItemType } from "../common/types";
import { Link } from "react-router-dom";
import { todoService } from "../api/todoService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const itemTypes = ["All", "Active", "Completed"];

const filterAndSortTodoItems = function (
  todoItems: ToDoItemType[],
  todoItemType: string
): ToDoItemType[] {
  let filteredItems = [];
  switch (todoItemType) {
    case "Active":
      filteredItems = todoItems.filter((todoItem) => todoItem.isDone === false);
      break;
    case "Completed":
      filteredItems = todoItems.filter((todoItem) => todoItem.isDone === true);
      break;
    default:
      filteredItems = todoItems;
  }

  return filteredItems.sort((a, b) => {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
};

export default function ToDoList() {
  const [searchText, setSearchText] = useState("");
  const [allTodoItems, setAllTodoItems] = useState<ToDoItemType[]>([]);
  const [activeItemType, setActiveItemType] = useState(itemTypes[0]);
  const { isLoading: todoItemsLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: todoService.getAllToDos,
    onSuccess(data) {
      setAllTodoItems(data);
    },
    onError() {
      toast.error("Something went wrong getting all todo items");
    },
  });

  let todoItems = filterAndSortTodoItems(allTodoItems, activeItemType);

  if (searchText != "") {
    todoItems = todoItems.filter((todoItem) =>
      todoItem.text.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  return (
    <div className="card bg-neutral text-primary-content">
      <div className="card-body pb-2">
        <h2 className="card-title">My ToDo List</h2>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search list"
          className="input w-full mt-1"
        />
        <div className="flex flex-row justify-between items-center">
          <div className="tabs">
            {itemTypes.map((itemType) => (
              <a
                key={itemType}
                className={`tab ${itemType == activeItemType && "tab-active"}`}
                onClick={() => {
                  setActiveItemType(itemType);
                }}
              >
                {itemType}
              </a>
            ))}
          </div>
          <Link to="/create">
            <button className="btn">New</button>
          </Link>
        </div>
      </div>
      <div className="divider h-0 m-0 w-full"></div>
      <div className="card-body">
        {/* Loading */}
        {todoItemsLoading && <p className="text-center">Loading..</p>}
        {/* Showing data */}
        {!todoItemsLoading &&
          (todoItems.length === 0 ? (
            <p className="text-center">No items..</p>
          ) : (
            <ul className="divide-y divide-gray-200 overflow-auto max-h-[60vh]">
              {todoItems.map((todoItem) => (
                <ToDoItem key={todoItem.id} todoItem={todoItem} />
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
}
