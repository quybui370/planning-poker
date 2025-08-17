import { useLocation, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { PockerTable } from "../components/PockerTable";
import { Welcome } from "./welcome";
import { writeData } from "../services/firebase";

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
    <div className="flex flex-col min-h-dvh">
      <Header
        onExitGame={() => {
          writeData(`/${roomId}/${userId}`, null);
        }}
      />
      <PockerTable />
    </div>
  );
}
