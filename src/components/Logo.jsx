import "./Logo.css";

// The RYZE kite symbol on its own
export function KiteMark(props) {
  let size = 40;
  if (props.size) {
    size = props.size;
  }

  return (
    <img
      className="kite-mark"
      src="/ryze-emblem.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
    />
  );
}

// Kite symbol + RYZE wordmark
function Logo() {
  return (
    <span className="logo">
      <KiteMark size={38} />
      <span className="logo-word">RYZE</span>
    </span>
  );
}

export default Logo;
