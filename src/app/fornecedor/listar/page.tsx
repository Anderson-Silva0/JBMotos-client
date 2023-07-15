'use client'

import FornecedorCard from "@/components/FornecedorCard"
import { Fornecedor } from "@/models/fornecedor"
import { mensagemErro } from "@/models/toast"
import { FornecedorService } from "@/services/fornecedorService"
import Image from "next/image"
import { useState, useEffect } from "react"
import imgFornecedor from "@/images/supplier.png"

export default function ListarFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const { buscarTodosFornecedores } = FornecedorService()

  useEffect(() => {
    const buscarTodos = async () => {
      try {
        const response = await buscarTodosFornecedores()
        setFornecedores(response.data)
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
          fornecedores.length > 1 ? (
            <>
              <Image src={imgFornecedor} width={60} height={60} alt="" /> {fornecedores.length} Fornecedores cadastrados
            </>
          ) : fornecedores.length === 1 ? (
            <>
              <Image src={imgFornecedor} width={60} height={60} alt="" /> {fornecedores.length} Fornecedor cadastrado
            </>
          ) : (
            'Nenhum Fornecedor cadastrado no sistema'
          )
        }
      </h1>

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
  )
}