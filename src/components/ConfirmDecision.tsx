import "@/styles/confirmDecision.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export function ConfirmDecision(
  title: string,
  message: string,
  callback: () => void
) {
  confirmAlert({
    customUI: ({ onClose }) => (
      <div className="confirm-custom-ui">
        <h1>{title}</h1>
        <hr className="hr-line" />
        <p>{message}</p>
        <button
          onClick={() => {
            callback();
            onClose();
          }}
        >
          Sim
        </button>
        <button className="cancel" onClick={onClose}>
          Não
        </button>
      </div>
    ),
    overlayClassName: "confirm-overlay",
  });
}
