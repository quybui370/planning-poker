import logo from "../assets/poker.svg";

export function Header() {
  const name = localStorage.getItem("name");
  return (
    <header className="container mx-auto px-2">
      <div className="flex justify-between items-center py-4 font-medium text-xl">
        <a href="/planning-poker/" className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <span>Planning poker game</span>
        </a>
        <div>Hello {name ?? "there"}!</div>
      </div>
    </header>
  );
}
