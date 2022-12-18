import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import _404 from "./routes/404";
import ToDoList from "./routes/ToDoList";
import CreateToDoItem from "./routes/CreateToDoItem";

export default function Router() {
  return (
    <BrowserRouter>
      <div className="py-12 px-4 container mx-auto">
        <Routes>
          <Route path="/" element={<ToDoList />} />
          <Route path="/create" element={<CreateToDoItem />} />
          <Route path="*" element={<_404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
