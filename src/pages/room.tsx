import { useLocation, useSearchParams } from "react-router-dom";
import Snowfall from "react-snowfall";
import bg from "../assets/bg.jpg";
import snowflake1 from "../assets/snowflake-1.png";
import snowflake2 from "../assets/snowflake-2.png";
import { Header } from "../components/Header";
import { PockerTable } from "../components/PockerTable";
import { writeData } from "../services/firebase";
import { Welcome } from "./welcome";

const snowflakeImages = [snowflake1, snowflake2].map((src) => {
  const img = document.createElement("img");
  img.src = src;
  return img;
});

export function Room() {
  const location = useLocation();
  const { userId } = location.state ?? {};
  const [searchParams] = useSearchParams();
  let roomId = searchParams.get("room");
  const name = localStorage.getItem("name")?.trim() ?? "";

  if (!userId || !roomId || !name) {
    return <Welcome />;
  }

  return (
    <div
      className="relative flex flex-col min-h-dvh bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/30">
        <Snowfall
          snowflakeCount={100}
          speed={[0.5, 1]}
          wind={[0, 1]}
          images={snowflakeImages}
          radius={[5, 10]}
          opacity={[0.5, 0.5]}
        />
        <Header
          onExitGame={() => {
            writeData(`/${roomId}/${userId}`, null);
          }}
        />
        <PockerTable />
      </div>
    </div>
  );
}
