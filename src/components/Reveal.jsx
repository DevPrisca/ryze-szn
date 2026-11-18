import { useEffect, useRef, useState } from "react";
import "./Reveal.css";

// Wrap anything in <Reveal> and it fades up when it scrolls into view.
// delay is in milliseconds (optional) so items can appear one after another.
function Reveal(props) {
  const boxRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(function () {
    const element = boxRef.current;

    if (element === null) {
      return undefined;
    }

    // Older browsers without IntersectionObserver: just show it
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);

    return function () {
      observer.disconnect();
    };
  }, []);

  let className = "reveal";
  if (visible === true) {
    className = "reveal reveal-in";
  }
  if (props.className) {
    className = className + " " + props.className;
  }

  let delay = 0;
  if (props.delay) {
    delay = props.delay;
  }

  return (
    <div ref={boxRef} className={className} style={{ transitionDelay: delay + "ms" }}>
      {props.children}
    </div>
  );
}

export default Reveal;
