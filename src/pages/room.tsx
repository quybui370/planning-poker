import { useLocation, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import Particles from "../components/Particles";
import { PockerTable } from "../components/PockerTable";
import { Share } from "../components/Share";
import { writeData } from "../services/firebase";
import { Welcome } from "./welcome";
import SplashCursor from "../components/SplashCursor";

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
    <Particles
      particleColors={["#ffffff"]}
      particleCount={500}
      particleSpread={15}
      speed={0.1}
      particleBaseSize={150}
      moveParticlesOnHover
      alphaParticles={true}
      disableRotation={true}
      pixelRatio={1}
      className="relative min-h-dvh flex flex-col"
    >
      <SplashCursor />
      <Header
        onExitGame={() => {
          writeData(`/${roomId}/${userId}`, null);
        }}
      />
      <PockerTable />
      <div className="fixed bottom-10 right-10">
        <Share />
      </div>
    </Particles>
  );
}
