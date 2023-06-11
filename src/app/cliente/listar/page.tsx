'use client'

import ClienteCard from "@/components/ClienteCard"
import { Cliente } from "@/models/cliente"
import { mensagemErro } from "@/models/toast"
import { ClienteService } from "@/services/clienteService"
import { useState, useEffect } from "react"

export default function ListarClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])

  const { buscarTodosClientes } = ClienteService()

  useEffect(() => {
    const buscarTodos = async () => {
      try {
        const response = await buscarTodosClientes()
        setClientes(response.data)
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscarTodos()
  }, [])

  return (
    <div>
      {
        clientes.length > 1 ? (
          <h1 className="centered-text">O sistema possui {clientes.length} Clientes cadastrados</h1>
        ) : clientes.length === 1 ? (
          <h1 className="centered-text">O sistema possui {clientes.length} Cliente cadastrado</h1>
        ) : clientes.length === 0 && (
          <h1 className="centered-text">O sistema não possui Clientes cadastrados</h1>
        )
      }

      <div>
        {clientes.map((cliente) => {
          return (
            <ClienteCard
              key={cliente.cpf}
              cpf={cliente.cpf}
              nome={cliente.nome}
              email={cliente.email}
              telefone={cliente.telefone}
              endereco={cliente.endereco}
              dataHoraCadastro={cliente.dataHoraCadastro}
            />
          );
        })}
      </div>
    </div>
  );
}