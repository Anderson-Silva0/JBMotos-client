'use client'

import { CpfInput } from "@/components/Input"
import LoadingLogo from "@/components/LoadingLogo"
import SaleCard from "@/components/VendaCard"
import imgVenda from "@/images/vendas.png"
import { parseDate } from "@/models/StringParaDate"
import { errorMessage } from "@/models/toast"
import { Sale } from "@/models/venda"
import { SaleService } from "@/services/VendaService"
import { Search } from "lucide-react"
import Image from "next/image"
import '@/styles/card.css'
import { useEffect, useState } from "react"

export default function ListarVendas() {
  const { filterSale: filtrarVenda } = SaleService()

  const [vendas, setVendas] = useState<Sale[]>([])
  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)
  const [valorInputBuscar, setValorInputBuscar] = useState<string>('')
  const [campoSelecionado, setCampoSelecionado] = useState<string>('')
  const [valorSelecionado, setValorSelecionado] = useState<string | null>(null)

  const alternarSelecaoCheckbox = (value: string) => {
    setValorSelecionado(value === valorSelecionado ? null : value)
  }

  useEffect(() => {
    if (valorSelecionado === 'antiga') {
      const sortedVendasRecentes = [...vendas].sort((a: Sale, b: Sale) =>
        parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime()
      )
      setVendas(sortedVendasRecentes)
    } else if (valorSelecionado === 'recente') {
      const sortedVendasRecentes = [...vendas].sort((a: Sale, b: Sale) =>
        parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime()
      )
      setVendas(sortedVendasRecentes)
    }
  }, [valorSelecionado])

  useEffect(() => {
    const buscarPorId = async () => {
      try {
        const vendaResponse = await filtrarVenda(campoSelecionado, valorInputBuscar)
        setVendas(vendaResponse.data)
      } catch (error: any) {
        errorMessage('Erro ao tentar buscar Venda.')
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
    return <LoadingLogo description='Carregando' />
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        {
          campoSelecionado === '' ? (
            vendas.length > 1 ? (
              <>
                <Image src={imgVenda} width={60} height={60} alt="" /> {vendas.length} Vendas Realizadas
              </>
            ) : vendas.length === 1 ? (
              <>
                <Image src={imgVenda} width={60} height={60} alt="" /> {vendas.length} Venda Realizada
              </>
            ) : (
              'Nenhuma Venda realizada no sistema'
            )
          ) : campoSelecionado !== '' && valorInputBuscar !== '' && (
            <>
              {
                vendas.length === 1 ? (
                  <strong>{vendas.length} venda encontrada</strong>
                ) : vendas.length > 1 ? (
                  <strong>{vendas.length} Vendas encontradas</strong>
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
                <p>Selecione o filtro desejado:</p>
              </div>
            ) : campoSelecionado === 'cpfCliente' ? (
              <CpfInput
                className="input-buscar"
                placeholder="Digite o CPF"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'cpfFuncionario' && (
              <CpfInput
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
            onChange={() => alternarSelecaoCheckbox('recente')}
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
            onChange={() => alternarSelecaoCheckbox('antiga')}
          />
        </div>
      </div>

      {vendas.map((venda) => {
        return (
          <SaleCard
            key={venda.id}
            id={venda.id}
            cardPayment={null}
            productsOfSale={[]}
            customer={venda.customer}
            employee={venda.employee}
            createdAt={venda.createdAt}
            observation={venda.observation}
            paymentMethod={venda.paymentMethod}
            totalSaleValue={venda.totalSaleValue}
          />
        )
      })}
    </div>
  )
}