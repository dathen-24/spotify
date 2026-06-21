import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";
import Register from "./pages/Register";
import Album from "./pages/Album";
import PlayList from "./pages/PlayList";
import Admin from "./pages/Admin";

const App = () => {
  const { isAuth, loading } = useUserData();
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
<Route element={<Layout />}>
  <Route path="/" element={<Home />} />

  <Route
    path="/album/:id"
    element={<Album />}
  />

  <Route
    path="/playlist/:id"
    element={
      isAuth
        ? <PlayList />
        : <Login />
    }
  />
</Route>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
