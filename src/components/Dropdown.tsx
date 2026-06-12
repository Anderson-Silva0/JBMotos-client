import { ChevronDown } from "lucide-react";
import { useRef, ReactNode, useEffect, Dispatch } from "react";

interface DropdownProps {
  title: string;
  children: ReactNode;
  componentClicked: string;
  setComponentClicked: Dispatch<React.SetStateAction<string>>;
  onNavigate?: () => void;
  isActive?: boolean;
}

export default function Dropdown({
  title: titulo,
  children,
  componentClicked,
  setComponentClicked,
  onNavigate,
  isActive = false,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOpen = componentClicked === titulo;

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (isOpen) {
      setComponentClicked("");
    } else {
      setComponentClicked(titulo);
    }
  };

  const handleClickAnywhere = (event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      isOpen
    ) {
      setComponentClicked("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickAnywhere);
    document.addEventListener("touchstart", handleClickAnywhere);

    return () => {
      document.removeEventListener("mousedown", handleClickAnywhere);
      document.removeEventListener("touchstart", handleClickAnywhere);
    };
  }, [isOpen, setComponentClicked]);

  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.closest("a")) {
      setComponentClicked("");
      if (onNavigate) {
        onNavigate();
      }
    }
  };

  return (
    <div className={`dropdown ${isOpen ? "is-open" : ""}`} ref={dropdownRef}>
      <button
        type="button"
        className={`dropdown-titulo ${isActive ? "is-active" : ""}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`${isOpen ? "Fechar" : "Abrir"} menu ${titulo}`}
      >
        {titulo}
        <ChevronDown strokeWidth={3} className="dropdown-icon" />
      </button>
      <div className={`dropdown-content ${isOpen ? "open" : ""}`} onClick={handleContentClick}>
        {children}
      </div>
    </div>
  );
}
