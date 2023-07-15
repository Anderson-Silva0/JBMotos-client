'use client'

import FuncionarioCard from "@/components/FuncionarioCard"
import { Funcionario } from "@/models/funcionario"
import { mensagemErro } from "@/models/toast"
import { FuncionarioService } from "@/services/funcionarioService"
import Image from "next/image"
import { useState, useEffect } from "react"
import imgFuncionario from "@/images/employee.png"

export default function ListarFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const { buscarTodosFuncionarios } = FuncionarioService()

  useEffect(() => {
    const buscarTodos = async () => {
      try {
        const response = await buscarTodosFuncionarios()
        setFuncionarios(response.data)
      } catch (error: any) {
        mensagemErro(error.response.data)
      } finally {
        setFoiCarregado(true)
      }
    }
    buscarTodos()
  }, [])

  if (!foiCarregado) {
    return <h1 className="carregando">Carregando...</h1>
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        {
          funcionarios.length > 1 ? (
            <>
              <Image src={imgFuncionario} width={60} height={60} alt="" /> {funcionarios.length} Funcionários cadastrados
            </>
          ) : funcionarios.length === 1 ? (
            <>
              <Image src={imgFuncionario} width={60} height={60} alt="" /> {funcionarios.length} Funcionário cadastrado
            </>
          ) : (
            'Nenhum Funcionário cadastrado no sistema'
          )
        }
      </h1>

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
        )
      })}
    </div>
  )
}