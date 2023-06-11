'use client'

import FuncionarioCard from "@/components/FuncionarioCard"
import { Funcionario } from "@/models/funcionario"
import { mensagemErro } from "@/models/toast"
import { FuncionarioService } from "@/services/funcionarioService"
import { useState, useEffect } from "react"

export default function ListarFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])

  const { buscarTodosFuncionarios } = FuncionarioService()

  useEffect(() => {
    const buscarTodos = async () => {
      try {
        const response = await buscarTodosFuncionarios()
        setFuncionarios(response.data)
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscarTodos()
  }, [])

  return (
    <div>
      {
        funcionarios.length > 1 ? (
          <h1 className="centered-text">O sistema possui {funcionarios.length} Funcionários cadastrados</h1>
        ) : funcionarios.length === 1 ? (
          <h1 className="centered-text">O sistema possui {funcionarios.length} Funcionário cadastrado</h1>
        ) : funcionarios.length === 0 && (
          <h1 className="centered-text">O sistema não possui Funcionários cadastrados</h1>
        )
      }

      <div>
        {funcionarios.map((funcionario) => {
          return (
            <FuncionarioCard
              key={funcionario.cpf}
              cpf={funcionario.cpf}
              nome={funcionario.nome}
              telefone={funcionario.telefone}
              endereco={funcionario.endereco}
              dataHoraCadastro={funcionario.dataHoraCadastro}
            />
          );
        })}
      </div>
    </div>
  );
}