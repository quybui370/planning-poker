import { useState } from "react";
import shareIcon from "../assets/share.svg";

export function Share() {
  const [toastVisible, setToastVisible] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="relative flex items-center">
      {toastVisible && (
        <div className="absolute right-full mr-3 whitespace-nowrap bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-lg shadow-lg flex items-center">
          The page URL is copied
          <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45" />
        </div>
      )}
      <button
        className="cursor-pointer w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-100 hover:scale-110 active:scale-125 transition-all duration-200"
        onClick={handleShare}
        title="Share this page"
      >
        <img src={shareIcon} alt="share" className="w-5 h-5" />
      </button>
    </div>
  );
}
