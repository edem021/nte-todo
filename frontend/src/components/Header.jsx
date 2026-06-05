import { FaPlay, FaPause } from "react-icons/fa";

const Header = ({ displayTime, isPlaying, onPlay, onPause }) => {
  return (
    <header className="header">
      <h1>NTE todo</h1>

      <div className="playtime-container">
        <div className="playtime-buttons">
          {isPlaying ? (
            <button onClick={onPause} className="playtime-button">
              <FaPause />
            </button>
          ) : (
            <button onClick={onPlay} className="playtime-button">
              <FaPlay />
            </button>
          )}
        </div>

        <div className="playtime-counter">
          {displayTime}
        </div>
      </div>
    </header>
  );
};

export default Header;
