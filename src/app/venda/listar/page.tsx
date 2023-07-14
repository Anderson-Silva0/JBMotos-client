'use client'

import VendaCard from "@/components/VendaCard"
import { Pedido } from "@/models/pedido"
import { mensagemErro } from "@/models/toast"
import { PedidoService } from "@/services/PedidoService"
import Image from "next/image"
import { useState, useEffect } from "react"
import imgVenda from "@/images/vendas.png"

export default function ListarVendas() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const { buscarTodosPedidos } = PedidoService()

  useEffect(() => {
    const buscarTodos = async () => {
      try {
        const response = await buscarTodosPedidos()
        setPedidos(response.data)
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
          pedidos.length > 1 ? (
            <>
              <Image src={imgVenda} width={60} height={60} alt="" /> {pedidos.length} Vendas Realizadas
            </>
          ) : pedidos.length === 1 ? (
            <>
              <Image src={imgVenda} width={60} height={60} alt="" /> {pedidos.length} Venda Realizada
            </>
          ) : (
            'Nenhuma Venda realizada no sistema'
          )
        }
      </h1>

      {pedidos.map((pedido) => {
        return (
          <VendaCard
            key={pedido.id}
            id={pedido.id}
            cpfCliente={pedido.cpfCliente}
            cpfFuncionario={pedido.cpfFuncionario}
            dataHoraCadastro={pedido.dataHoraCadastro}
            observacao={pedido.observacao}
            formaDePagamento={pedido.formaDePagamento}
          />
        )
      })}
    </div>
  )
}