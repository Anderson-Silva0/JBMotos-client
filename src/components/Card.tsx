import { ReactNode } from "react"
import '../styles/card.css'

interface CardProps {
    children?: ReactNode
    titulo?: string
}

export function Card({ children, titulo }: CardProps) {
    return (
        <div className="card">
            <h3 className="card-header">{titulo}</h3>
            <div className="card-body">
                {children}
            </div>
        </div>
    )
}