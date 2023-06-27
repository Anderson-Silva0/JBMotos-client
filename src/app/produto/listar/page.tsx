'use client'

import ProdutoCard from "@/components/ProdutoCard"
import { Produto } from "@/models/produto"
import { mensagemErro } from "@/models/toast"
import { ProdutoService } from "@/services/produtoService"
import { useState, useEffect } from "react"

export default function ListarClientes() {
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
    return <h1>Carregando...</h1>
  }

  return (
    <div>
      {
        produtos.length > 1 ? (
          <h1 className="centered-text">O sistema possui {produtos.length} Produtos cadastrados</h1>
        ) : produtos.length === 1 ? (
          <h1 className="centered-text">O sistema possui {produtos.length} Produto cadastrado</h1>
        ) : produtos.length === 0 && (
          <h1 className="centered-text">O sistema não possui Produto cadastrado</h1>
        )
      }

      <div>
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
          );
        })}
      </div>
    </div>
  );
}