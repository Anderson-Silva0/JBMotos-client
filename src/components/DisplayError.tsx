import React from 'react';

interface Error {
  inputName: string
  errorMessage: string
}

interface DisplayErrorProps {
  errors: Error[]
  inputName: string
}

export function DisplayError({ errors, inputName }: DisplayErrorProps) {
  const errorExisting = errors.find(error => error.inputName === inputName);

  if (errorExisting) {
    return (
      <span className="erro">
        {errorExisting.errorMessage}
      </span>
    );
  }

  return null;
}
