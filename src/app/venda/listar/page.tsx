'use client'

import { InputCpf } from "@/components/Input"
import VendaCard from "@/components/VendaCard"
import imgVenda from "@/images/vendas.png"
import { Pedido } from "@/models/pedido"
import { mensagemErro } from "@/models/toast"
import { PedidoService } from "@/services/PedidoService"
import { Search } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function ListarVendas() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const [valorInputBuscar, setValorInputBuscar] = useState<string>('')

  const [campoSelecionado, setCampoSelecionado] = useState<string>('')

  const { filtrarPedido } = PedidoService()

  const [valorSelecionado, setValorSelecionado] = useState<string | null>(null)

  const handleCheckboxChange = (value: string) => {
    setValorSelecionado(value === valorSelecionado ? null : value)
  }

  useEffect(() => {
    if (valorSelecionado === 'antiga') {
      const sortedPedidosRecentes = [...pedidos].sort((a: Pedido, b: Pedido) =>
        parseDate(a.dataHoraCadastro).getTime() - parseDate(b.dataHoraCadastro).getTime()
      )
      setPedidos(sortedPedidosRecentes)
    } else if (valorSelecionado === 'recente') {
      const sortedPedidosRecentes = [...pedidos].sort((a: Pedido, b: Pedido) =>
        parseDate(b.dataHoraCadastro).getTime() - parseDate(a.dataHoraCadastro).getTime()
      )
      setPedidos(sortedPedidosRecentes)
    }
  }, [valorSelecionado])

  // Função para fazer parsing da string de data para Date
  const parseDate = (dateStr: string) => {
    const [datePart, timePart] = dateStr.split(' ')
    const [day, month, year] = datePart.split('/')
    const [hours, minutes] = timePart.split(':')
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes))
  }

  useEffect(() => {
    const buscarPorId = async () => {
      try {
        const pedidoResponse = await filtrarPedido(campoSelecionado, valorInputBuscar)
        setPedidos(pedidoResponse.data)
      } catch (error: any) {
        mensagemErro('Erro ao tentar buscar Pedido.')
      } finally {
        setFoiCarregado(true)
      }
    }
    buscarPorId()
  }, [valorInputBuscar, campoSelecionado])

  useEffect(() => {
    setValorInputBuscar('')
  }, [campoSelecionado])

  const handleRadioClick = (campo: string) => {
    if (campoSelecionado === campo) {
      setCampoSelecionado('')
    }
  }

  if (!foiCarregado) {
    return <h1 className="carregando">Carregando...</h1>
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        {
          campoSelecionado === '' ? (
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
          ) : campoSelecionado !== '' && valorInputBuscar !== '' && (
            <>
              {
                pedidos.length === 1 ? (
                  <strong>{pedidos.length} Venda encontrada</strong>
                ) : pedidos.length > 1 ? (
                  <strong>{pedidos.length} Vendas encontradas</strong>
                ) : (
                  'Nenhuma Venda encontrada'
                )
              }
            </>
          )
        }
      </h1>
      <div className="div-container-buscar">
        <div className="div-buscar">
          <Search size={60} strokeWidth={3} />
          {
            campoSelecionado === '' ? (
              <div className="div-msg-busca">
                <p>Selecione uma opção de busca:</p>
                <p>CPF do Cliente, CPF do Funcionário ou Filtro por data.</p>
              </div>
            ) : campoSelecionado === 'cpfCliente' ? (
              <InputCpf
                className="input-buscar"
                placeholder="Digite o CPF"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'cpfFuncionario' && (
              <InputCpf
                className="input-buscar"
                placeholder="Digite o CPF"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            )
          }
        </div>
        <div className="div-radios">
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoNome">CPF do Cliente</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoNome"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('cpfCliente')}
              onClick={() => handleRadioClick('cpfCliente')}
              checked={campoSelecionado === 'cpfCliente'}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoMarca">CPF do Funcionário</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoMarca"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('cpfFuncionario')}
              onClick={() => handleRadioClick('cpfFuncionario')}
              checked={campoSelecionado === 'cpfFuncionario'}
            />
          </div>
        </div>
      </div>
      <div className="div-dupla-check">
        <div style={{ display: 'flex', whiteSpace: 'nowrap', fontWeight: 'bolder' }}>
          <label className="label-radio" htmlFor="recente">Mais recente</label>
          <input
            className="input-check"
            type="checkbox"
            name="filtroData"
            id="recente"
            value="recente"
            checked={valorSelecionado === 'recente'}
            onChange={() => handleCheckboxChange('recente')}
          />
        </div>
        <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          <label className="label-radio" htmlFor="antiga">Mais antiga</label>
          <input
            className="input-check"
            type="checkbox"
            name="filtroData"
            id="antiga"
            value="antiga"
            checked={valorSelecionado === 'antiga'}
            onChange={() => handleCheckboxChange('antiga')}
          />
        </div>
      </div>

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