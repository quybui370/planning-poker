import { useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { PockerTable } from "../components/PockerTable";
import { Welcome } from "./welcome";

export function Room() {
  const location = useLocation();
  const { userId } = location.state || {};

  if (!userId) {
    return <Welcome />;
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <PockerTable />
    </div>
  );
}
