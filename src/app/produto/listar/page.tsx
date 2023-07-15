'use client'

import ProdutoCard from "@/components/ProdutoCard"
import { Produto } from "@/models/produto"
import { mensagemErro } from "@/models/toast"
import { ProdutoService } from "@/services/produtoService"
import { useState, useEffect } from "react"
import imgProduto from '@/images/checklist.png'
import Image from "next/image"

export default function ListarProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const { buscarTodosProdutos } = ProdutoService()

  useEffect(() => {
    const buscarTodos = async () => {
      try {
        const response = await buscarTodosProdutos()
        setProdutos(response.data)
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
          produtos.length > 1 ? (
            <>
              <Image src={imgProduto} width={60} height={60} alt="" /> {produtos.length} Produtos cadastrados
            </>
          ) : produtos.length === 1 ? (
            <>
              <Image src={imgProduto} width={60} height={60} alt="" /> {produtos.length} Produto cadastrado
            </>
          ) : (
            'Nenhum Produto cadastrado no sistema'
          )
        }
      </h1>

      {produtos.map((produto) => {
        return (
          <ProdutoCard
            key={produto.id}
            id={produto.id}
            nome={produto.nome}
            precoCusto={produto.precoCusto}
            precoVenda={produto.precoVenda}
            marca={produto.marca}
            idEstoque={produto.idEstoque}
            cnpjFornecedor={produto.cnpjFornecedor}
          />
        )
      })}
    </div>
  );
}