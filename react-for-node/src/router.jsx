import { BrowserRouter, Routes, Route } from "react-router";
import Header from "./Header.jsx";
import App from "./App.jsx";
import AddUser from "./AddUser.jsx";
import EditUser from "./EditUser.jsx";

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add" element={<AddUser />} />
        <Route path="/edit/:EditID" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
