import React, { ReactNode } from 'react'

export default function TabelaTeste({ children }: { children: ReactNode }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Valor Unidade</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div >
  )
}