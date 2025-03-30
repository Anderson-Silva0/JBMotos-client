import { ReactNode } from "react";
import "../styles/card.css";

interface CardProps {
  children?: ReactNode;
  title?: string;
}

export function Card({ children, title: title }: CardProps) {
  return (
    <div className="card">
      <h3 className="card-header">{title}</h3>
      <hr className="card-hr" />
      <div className="card-body">{children}</div>
    </div>
  );
}
