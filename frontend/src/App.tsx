import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";
import Album from "./pages/Album";
import PlayList from "./pages/PlayList";
import Layout from "./components/Layout"; // <-- Thêm import Layout

const App = () => {
  const { isAuth, loading } = useUserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          {/* Bọc các Route bên trong thẻ Routes */}
          <Routes>
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
