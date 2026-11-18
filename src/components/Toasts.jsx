import "./Toasts.css";

function Toasts(props) {
  const list = [];

  // A loop is used here because the number of toasts changes while the site runs
  for (let i = 0; i < props.toasts.length; i++) {
    const toast = props.toasts[i];
    let icon = "i";
    if (toast.type === "success") {
      icon = "✓";
    }
    if (toast.type === "error") {
      icon = "!";
    }

    list.push(
      <div key={toast.id} className={"toast toast-" + toast.type} role="status">
        <span className="toast-icon">{icon}</span>
        <span className="toast-message">{toast.message}</span>
        <button
          className="toast-close"
          onClick={function () {
            props.onClose(toast.id);
          }}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="toast-area" aria-live="polite">
      {list}
    </div>
  );
}

export default Toasts;
