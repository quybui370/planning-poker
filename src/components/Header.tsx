import { useNavigate } from "react-router-dom";
import exit from "../assets/exit.svg";
import logo from "../assets/poker.svg";

export function Header(props: { onExitGame?: () => void }) {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const onExitGame = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    props.onExitGame?.();
    navigate("/planning-poker/", { replace: true });
  };

  return (
    <header className="container mx-auto px-2">
      <div className="flex justify-between items-center py-4 font-medium text-xl">
        <a href="/planning-poker/" className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <span>Planning poker game</span>
        </a>
        <div className="flex items-center gap-3">
          <p>Hello {name ?? "there"}!</p>
          {name && (
            <button className="cursor-pointer" onClick={onExitGame}>
              <img
                title="Exit game"
                src={exit}
                alt="exit"
                className="w-6 h-6 cursor-pointer"
                onClick={props.onExitGame}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
