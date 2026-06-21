import AlbumCard from "../components/AlbumCard";
import Loading from "../components/Loading";
import SongCard from "../components/SongCard";
import { useSongData } from "../context/SongContext";

const Home = () => {
  const { albums, songs, loading } = useSongData();
  
  // Trả về trực tiếp điều kiện loading
  return loading ? (
    <Loading />
  ) : (
    // Dùng Fragment để bọc nội dung khi loading xong
    <>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
          {albums?.map((e) => {
            return (
              <AlbumCard
                key={e.id}
                image={e.thumbnail}
                name={e.title}
                desc={e.description}
                id={e.id}
              />
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
          {songs?.map((e) => {
            return (
              <SongCard
                key={e.id}
                image={e.thumbnail}
                name={e.title}
                desc={e.description}
                id={e.id}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
