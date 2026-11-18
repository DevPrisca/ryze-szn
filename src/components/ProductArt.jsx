import "./ProductArt.css";

// A small kite badge drawn on the garment
function KiteBadge(props) {
  const transform = "translate(" + props.x + " " + props.y + ") scale(" + props.scale + ")";

  return (
    <g transform={transform}>
      <image
        href="/ryze-emblem.png"
        x="-17"
        y="-25"
        width="34"
        height="50"
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

// Draws the garment. If the product has a real photo (image), the photo is shown instead.
function ProductArt(props) {
  const type = props.type;
  const color = props.color;
  const accent = props.accent;
  if (props.image) {
    return (
      <div className="art">
        <img className="art-photo" src={props.image} alt={props.alt || "RYZE product"} />
      </div>
    );
  }

  let garment = null;

  if (type === "tee") {
    garment = (
      <g>
        <path
          d="M72 24 L28 48 L8 96 L40 108 L52 90 L52 210 L148 210 L148 90 L160 108 L192 96 L172 48 L128 24 Q100 46 72 24 Z"
          fill={color}
          stroke="#6a6a6a"
          strokeWidth="2"
        />
        <path d="M72 24 Q100 46 128 24 Q100 62 72 24 Z" fill="#00000055" />
        <KiteBadge x={100} y={104} scale={1.15} color={accent} />
      </g>
    );
  }

  if (type === "hoodie") {
    garment = (
      <g>
        <path
          d="M70 30 L24 54 L6 168 L40 174 L52 120 L52 212 L148 212 L148 120 L160 174 L194 168 L176 54 L130 30 Q100 60 70 30 Z"
          fill={color}
          stroke="#6a6a6a"
          strokeWidth="2"
        />
        <path d="M68 32 Q100 -10 132 32 Q100 70 68 32 Z" fill="#00000040" stroke="#6a6a6a" strokeWidth="2" />
        <path d="M88 52 L86 84 M112 52 L114 84" stroke="#ffffff55" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M66 160 L134 160 L142 204 L58 204 Z" fill="#00000030" stroke="#6a6a6a" strokeWidth="1.5" />
        <KiteBadge x={100} y={120} scale={0.95} color={accent} />
      </g>
    );
  }

  if (type === "joggers") {
    garment = (
      <g>
        <path
          d="M58 14 L142 14 L152 212 L108 212 L100 84 L92 212 L48 212 Z"
          fill={color}
          stroke="#6a6a6a"
          strokeWidth="2"
        />
        <rect x="58" y="14" width="84" height="16" fill="#00000050" />
        <path d="M100 30 L100 84" stroke="#00000066" strokeWidth="2" />
        <path d="M48 196 L92 196 M108 196 L152 196" stroke="#00000066" strokeWidth="6" />
        <KiteBadge x={74} y={66} scale={0.6} color={accent} />
      </g>
    );
  }

  if (type === "cap") {
    garment = (
      <g>
        <path
          d="M34 138 Q34 56 100 56 Q166 56 166 138 Z"
          fill={color}
          stroke="#6a6a6a"
          strokeWidth="2"
        />
        <path d="M100 56 L100 138 M68 64 Q60 100 62 138 M132 64 Q140 100 138 138" stroke="#00000055" strokeWidth="1.5" fill="none" />
        <path
          d="M26 138 Q100 118 192 150 Q100 170 26 138 Z"
          fill={color}
          stroke="#6a6a6a"
          strokeWidth="2"
        />
        <path d="M26 138 Q100 118 192 150 Q100 140 26 138 Z" fill="#ffffff22" />
        <circle cx="100" cy="52" r="5" fill={accent} />
        <KiteBadge x={100} y={100} scale={0.8} color={accent} />
      </g>
    );
  }

  return (
    <div className="art">
      <div className="art-glow"></div>
      <svg className="art-svg" viewBox="0 0 200 240" role="img" aria-label={props.alt || "RYZE product"}>
        {garment}
      </svg>
    </div>
  );
}

export default ProductArt;
