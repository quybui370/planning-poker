import { nanoid } from "nanoid";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { writeData } from "../services/firebase";

export function Welcome() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  let { roomId } = useParams();
  let isHost = Boolean(!roomId).toString();
  roomId = roomId ?? nanoid(10);
  const userId = nanoid(10);

  const handleClick = () => {
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("id", userId);
    writeData(`/${roomId}/${userId}`, {
      name,
      vote: "",
      isHost,
    });
    navigate(`/${roomId}`, {
      state: {
        userId,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <div className="container mx-auto flex justify-center items-center grow">
        <div className="flex flex-col items-center w-96 bg-slate-700 rounded-2xl p-10 gap-7">
          <h1 className="font-medium text-xl">Choose your display name</h1>
          <input
            onChange={(e) => setName(e.target.value)}
            className="p-1 border-2 rounded w-full border-slate-500"
          />
          <button
            onClick={handleClick}
            className="bg-sky-600 hover:bg-sky-500 rounded-lg py-3 px-4 cursor-pointer"
          >
            Continue to game
          </button>
        </div>
      </div>
    </div>
  );
}
