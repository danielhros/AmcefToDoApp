import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import _404 from "./routes/404";
import ToDoList from "./routes/ToDoList";
import ToDoLists from "./routes/ToDoLists";
import CreateToDoItem from "./routes/CreateToDoItem";

export default function Router() {
  return (
    <BrowserRouter>
      <div className="py-12 px-4 container mx-auto">
        <Routes>
          <Route path="/" element={<ToDoLists />} />
          <Route path="list/:id" element={<ToDoList />} />
          <Route path="list/:id/new_item" element={<CreateToDoItem />} />
          <Route path="*" element={<_404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
