import { nanoid } from "nanoid";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { writeData } from "../services/firebase";

export function Welcome() {
  const navigate = useNavigate();
  const [name, setName] = useState(localStorage.getItem("name")?.trim() ?? "");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  let roomId = searchParams.get("room");
  let isHost = Boolean(!roomId);
  roomId = roomId ?? nanoid(10);
  const userId = localStorage.getItem("id") ?? nanoid(10);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter your name before you start");
      return;
    }

    localStorage.setItem("name", name);
    localStorage.setItem("id", userId);
    writeData(`/${roomId}/${userId}`, {
      name,
      vote: "",
    });
    navigate(`/planning-poker/?room=${roomId}`, {
      state: {
        userId,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <div className="container mx-auto px-2 flex justify-center items-center grow">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col items-center w-96 bg-slate-700 rounded-2xl p-10 gap-7"
        >
          {!localStorage.getItem("name")?.trim() ? (
            <>
              <h1 className="font-medium text-xl">Choose your display name</h1>
              <div className="w-full">
                <input
                  onChange={(e) => setName(e.target.value)}
                  className="p-1 mb-2 border-2 rounded w-full border-slate-500"
                />
                <p className="text-red-400">{error}</p>
              </div>
            </>
          ) : (
            <h1 className="font-medium text-xl">Welcome back</h1>
          )}
          <button className="bg-sky-600 hover:bg-sky-500 rounded-lg py-3 px-4 cursor-pointer">
            {isHost ? "Start a new game" : "Join room"}
          </button>
        </form>
      </div>
    </div>
  );
}
