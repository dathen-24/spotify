import { useEffect, useState } from "react";
import { Song, useSongData } from "../context/SongContext";
import { useUserData } from "../context/UserContext";
import { usePlaylistData } from "../context/PlaylistContext";
import { FaBookmark, FaPlay, FaTrash, FaEdit, FaGlobeAmericas, FaLock } from "react-icons/fa";
import Loading from "../components/Loading";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const playlistServer = import.meta.env.VITE_PLAYLIST_API;

const PlayList = () => {
  // 1. GỌI TẤT CẢ HOOKS Ở TRÊN CÙNG
  const { id } = useParams();
  const navigate = useNavigate();

  const { songs, setIsPlaying, setQueue, setCurrentIndex } = useSongData();
  const { isAuth } = useUserData();
  const {
    playlists,
    playlistLoading,
    fetchMyPlaylists,
    removeSongFromPlaylist,
    deletePlaylist,
    updatePlaylist,
  } = usePlaylistData();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (isAuth) {
      fetchMyPlaylists();
    }
  }, [isAuth, id]);

  useEffect(() => {
    console.log("PLAYER MOUNT");
    return () => {
      console.log("PLAYER UNMOUNT");
    };
  }, []);

  // 2. KHỞI TẠO CÁC BIẾN LOGIC
  const currentPlaylist = playlists.find((p) => p._id === id);
  const currentSongs = currentPlaylist?.songs || [];

  const validSongs = currentSongs.filter((playlistSong) =>
    songs.some((song) => String(song.id) === String(playlistSong.songId))
  );

  // SỬA LỖI TYPESCRIPT Ở ĐÂY: Ép kiểu để báo TypeScript mảng này không còn undefined
const playlistQueue: Song[] = validSongs
  .map((playlistSong) =>
    songs.find(
      (song) =>
        String(song.id) ===
        String(playlistSong.songId)
    )
  )
  .filter(
    (song): song is Song =>
      song !== undefined
  );

  // 3. ĐỊNH NGHĨA CÁC HÀM XỬ LÝ
  const handleDeletePlaylist = async () => {
    if (!currentPlaylist) return;
    await deletePlaylist(currentPlaylist._id);
    navigate("/");
  };

  const handleOpenEdit = () => {
    if (!currentPlaylist) return;
    setEditName(currentPlaylist.name);
    setEditDescription(currentPlaylist.description);
    setEditCoverImage(currentPlaylist.coverImage || "");
    setIsPublic(currentPlaylist.isPublic);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!currentPlaylist) return;
    await updatePlaylist(
      currentPlaylist._id,
      editName,
      editDescription,
      isPublic,
      editCoverImage
    );
    setShowEditModal(false);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post(
      `${playlistServer}/api/v1/playlist/upload-cover`,
      formData,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    setEditCoverImage(data.imageUrl);
  };

  // 4. XỬ LÝ RENDER THEO ĐIỀU KIỆN
  if (playlistLoading) {
    return <Loading />;
  }

  // Nếu loading xong mà không tìm thấy playlist
  if (!currentPlaylist) {
    return (
      <>
        <div className="mt-20 text-center text-zinc-400">
          Playlist not found
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mt-6 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 p-8">
        <div className="flex flex-col md:flex-row gap-8 items-end">
          <div className="w-64 h-64 rounded-xl overflow-hidden shadow-2xl bg-zinc-800 flex items-center justify-center">
            {currentPlaylist?.coverImage ? (
              <img
                src={currentPlaylist.coverImage}
                alt={currentPlaylist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaBookmark className="text-8xl text-zinc-500" />
            )}
          </div>

          <div className="flex-1">
            <p className="uppercase text-sm tracking-widest">Playlist</p>
            <h1 className="text-6xl md:text-6xl font-semibold mt-2">
              {currentPlaylist?.name}
            </h1>
            <p className="mt-4 text-zinc-300">
              {currentPlaylist?.description}
            </p>
            <div className="flex items-center gap-4 mt-4 text-zinc-400">
              <span>{validSongs.length} songs</span>
              <span>•</span>
              <div className="flex items-center gap-2">
                {currentPlaylist?.isPublic ? <FaGlobeAmericas /> : <FaLock />}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => {
              if (playlistQueue.length === 0) return;
              setQueue(playlistQueue);
              setCurrentIndex(0);
              setIsPlaying(true);
            }}
            className="w-14 h-14 rounded-full bg-green-500 text-black flex items-center justify-center text-xl hover:scale-105 transition"
          >
            <FaPlay />
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleOpenEdit}
              className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
            >
              <FaEdit />
            </button>
            <button
              onClick={handleDeletePlaylist}
              className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-red-500 flex items-center justify-center"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-[60px_2fr_2fr_120px] px-4 py-3 text-zinc-400 border-b border-zinc-700">
          <p>#</p>
          <p>Title</p>
          <p>Description</p>
        </div>

        <hr />

        {validSongs.length  === 0 ? (
          <p className="text-center mt-10 text-slate-400">
            This playlist is empty
          </p>
        ) : (
          validSongs.map((playlistItem, index) => {
            // SỬA LỖI GIAO DIỆN Ở ĐÂY: Tìm chi tiết bài hát từ mảng songs
            const songDetail = songs.find(
              (validSongs) => String(validSongs.id) === String(playlistItem.songId)
            );

            // Nếu không tìm thấy thông tin bài hát thì bỏ qua
            if (!songDetail) return null;

            return (
              <div
                key={playlistItem.songId}
                onClick={() => {
                  setQueue(playlistQueue);
                  setCurrentIndex(index);
                  setIsPlaying(true);
                }}
                className="grid grid-cols-[60px_2fr_2fr_120px] items-center px-4 py-3 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <p>{index + 1}</p>

                <div className="flex items-center gap-4">
                  <img
                    src={songDetail.thumbnail}
                    className="w-12 h-12 rounded object-cover"
                    alt=""
                  />
                  <p className="text-white">{songDetail.title}</p>
                </div>

                <p className="truncate text-zinc-400">{songDetail.description}</p>

                <div className="flex items-center gap-4">
                  <button
                    className="text-white hover:text-red-500 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSongFromPlaylist(
                        currentPlaylist._id,
                        playlistItem.songId
                      );
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#181818] p-8 rounded-2xl w-[550px] border border-zinc-700 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Edit Playlist</h2>

            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Playlist Name"
              className="w-full p-3 rounded bg-zinc-800 mb-3"
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-3 rounded bg-zinc-800 h-28"
            />
            
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="w-full p-3 rounded bg-zinc-800 mt-3"
            />

            {editCoverImage && (
              <img
                src={editCoverImage}
                className="mt-4 w-full h-52 object-cover rounded-xl"
                alt="Cover Preview"
              />
            )}

            <label className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              Public Playlist
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-zinc-300"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-500 text-black rounded font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayList;
