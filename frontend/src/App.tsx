import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Thêm lại import Register
import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";
import Album from "./pages/Album";
import PlayList from "./pages/PlayList";
import Layout from "./components/Layout";
import Admin from "./pages/Admin";

const App = () => {
  const { isAuth, loading } = useUserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            {/* 1. Các trang KHÔNG dùng Layout (Full màn hình) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/admin/dashboard" 
              element={isAuth ? <Admin /> : <Login />} 
            />

            {/* 2. Các trang CÓ dùng Layout (Có Sidebar, Player...) */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/album/:id" element={<Album />} />
              <Route
                path="/playlist/:id"
                element={isAuth ? <PlayList /> : <Login />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
