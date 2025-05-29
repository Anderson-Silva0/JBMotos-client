import React from 'react';

interface WelcomeHeaderProps {
  userName: string;
}

export default function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <header className="welcome">
      <h1 className="welcome__title">Olá, {userName}!</h1>
      <p className="welcome__subtitle">
        Bem-vindo ao sistema <span className="welcome__highlight">JB Motos</span>
      </p>
    </header>
  );
}
