import { Plus } from "lucide-react";
import { useRef, ReactNode, useState, useEffect, Dispatch } from "react";

interface DropdownProps {
  title: string;
  children: ReactNode;
  componentClicked: string;
  setComponentClicked: Dispatch<React.SetStateAction<string>>;
}

export default function Dropdown({
  title: titulo,
  children,
  componentClicked,
  setComponentClicked,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClickContent = () => {
    if (contentRef.current) {
      const dropdownContent = contentRef.current.style;
      const computedDisplay = window.getComputedStyle(
        contentRef.current
      ).display;

      if (computedDisplay === "none" && !isOpen && componentClicked === "") {
        dropdownContent.display = "flex";
        dropdownContent.flexDirection = "column";
        setIsOpen(true);
        setComponentClicked(titulo);
      } else if (isOpen && titulo === componentClicked) {
        dropdownContent.display = "none";
        setIsOpen(false);
        setComponentClicked("");
      }
    }
  };

  const handleClickAnywhere = (event: any) => {
    if (
      contentRef.current &&
      !contentRef.current.contains(event.target as Node) &&
      isOpen &&
      titulo === componentClicked
    ) {
      contentRef.current.style.display = "none";
      setIsOpen(false);
      setComponentClicked("");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickAnywhere);

    return () => {
      document.removeEventListener("click", handleClickAnywhere);
    };
  }, [isOpen]);

  return (
    <div onClick={handleClickContent} className="dropdown">
      <span className="dropdown-titulo">
        {titulo}
        <Plus strokeWidth={3} style={{ verticalAlign: "middle" }} />
      </span>
      <div className="dropdown-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
