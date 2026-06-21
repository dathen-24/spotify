import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";
import Album from "./pages/Album";
import PlayList from "./pages/PlayList";
import Layout from "./components/Layout";
import Admin from "./pages/Admin"; // 1. Import lại component Admin

const App = () => {
  const { isAuth, loading } = useUserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            {/* 2. Thêm Route cho Admin ở đây (Nằm ngoài Layout) */}
            <Route 
              path="/admin/dashboard" 
              element={isAuth ? <Admin /> : <Login />} 
            />

            {/* Các route của user bình thường nằm trong Layout */}
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
