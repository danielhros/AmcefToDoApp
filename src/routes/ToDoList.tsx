import React, { useState } from "react";
import ToDoItem from "../components/ToDoItem";
import { ToDoItem as ToDoItemType } from "../common/types";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import { todoService } from "../api/todoService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";

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
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [allTodoItems, setAllTodoItems] = useState<ToDoItemType[]>([]);
  const [todoTitle, setTodoTitle] = useState("Loading..");
  const [activeItemType, setActiveItemType] = useState(itemTypes[0]);

  const { id: todoListId } = useParams();

  const { mutate: deleteList, isLoading: deleteListIsLoading } = useMutation({
    mutationFn: todoService.deleteToDoList,
    onSuccess: () => {
      queryClient.invalidateQueries(["todoLists"]);
      queryClient.invalidateQueries(["todoList", todoListId]);
      navigate(`/`);
    },
    onError() {
      toast.error("Something went wrong deleting this list");
    },
  });

  // I didn't have time, this is just workaround
  if (todoListId === undefined) {
    redirect("/404");
    return <></>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isLoading: todoItemsLoading } = useQuery({
    queryKey: ["todoList", todoListId],
    queryFn: () => todoService.getAllToDos(todoListId),
    onSuccess(data) {
      setAllTodoItems(data.items);
      setTodoTitle(data.title);
    },
    onError() {
      toast.error("Something went wrong getting all todo items");
      setTodoTitle("Error loading title");
    },
  });

  let todoItems = filterAndSortTodoItems(allTodoItems, activeItemType);

  if (searchText != "") {
    todoItems = todoItems.filter(
      (todoItem) =>
        todoItem.text.toLowerCase().includes(searchText.toLowerCase()) ||
        todoItem.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  return (
    <>
      <div className="card bg-neutral text-primary-content">
        <div className="card-body pb-2">
          <h2 className="card-title">{todoTitle}</h2>
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
                  className={`tab ${
                    itemType == activeItemType && "tab-active"
                  }`}
                  onClick={() => {
                    setActiveItemType(itemType);
                  }}
                >
                  {itemType}
                </a>
              ))}
            </div>
            <Link to="new_item">
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

      <div className="toast">
        <div
          className="tooltip tooltip-open tooltip-left"
          data-tip="Delete this todo list"
        >
          <button
            disabled={deleteListIsLoading}
            type="submit"
            onClick={() => deleteList(todoListId)}
            className="btn btn-ghost"
          >
            <FaTrashAlt size={30} />
          </button>
        </div>
      </div>
    </>
  );
}
