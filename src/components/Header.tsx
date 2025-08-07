export function Header() {
  const name = sessionStorage.getItem("name");
  return (
    <header className="container mx-auto">
      <div className="flex justify-between items-center py-4 font-medium text-xl">
        <div className="flex items-center gap-3">
          <img src="/poker.svg" alt="logo" className="w-10 h-10" />
          <span>Planning poker game</span>
        </div>
        <div>Hello {name ?? "there"}!</div>
      </div>
    </header>
  );
}
