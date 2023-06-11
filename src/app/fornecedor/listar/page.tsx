'use client'

import FornecedorCard from "@/components/FornecedorCard"
import { Fornecedor } from "@/models/fornecedor"
import { mensagemErro } from "@/models/toast"
import { FornecedorService } from "@/services/fornecedorService"
import { useState, useEffect } from "react"

export default function ListarFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])

  const { buscarTodosFornecedores } = FornecedorService()

  useEffect(() => {
    const buscarTodos = async () => {
      try {
        const response = await buscarTodosFornecedores()
        setFornecedores(response.data)
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscarTodos()
  }, [])

  return (
    <div>
      {
        fornecedores.length > 1 ? (
          <h1 className="centered-text">O sistema possui {fornecedores.length} Fornecedores cadastrados</h1>
        ) : fornecedores.length === 1 ? (
          <h1 className="centered-text">O sistema possui {fornecedores.length} Fornecedor cadastrado</h1>
        ) : fornecedores.length === 0 && (
          <h1 className="centered-text">O sistema não possui Fornecedores cadastrados</h1>
        )
      }

      <div>
        {fornecedores.map((fornecedor) => {
          return (
            <FornecedorCard
              key={fornecedor.cnpj}
              cnpj={fornecedor.cnpj}
              nome={fornecedor.nome}
              telefone={fornecedor.telefone}
              endereco={fornecedor.endereco}
              dataHoraCadastro={fornecedor.dataHoraCadastro}
            />
          );
        })}
      </div>
    </div>
  );
}