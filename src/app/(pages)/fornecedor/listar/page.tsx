'use client'

import SupplierCard from "@/components/FornecedorCard"
import { CnpjInput, PhoneInput } from "@/components/Input"
import LoadingLogo from "@/components/LoadingLogo"
import imgFornecedor from "@/images/supplier.png"
import { parseDate } from "@/models/StringParaDate"
import { Supplier } from "@/models/fornecedor"
import { errorMessage } from "@/models/toast"
import { SupplierService } from "@/services/fornecedorService"
import { Search } from "lucide-react"
import Image from "next/image"
import '@/styles/card.css'
import { useEffect, useState } from "react"

export default function ListarFornecedores() {
  const [fornecedores, setFornecedores] = useState<Supplier[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const [valorInputBuscar, setValorInputBuscar] = useState<string>('')

  const [campoSelecionado, setCampoSelecionado] = useState<string>('')

  const { filterSupplier: filtrarFornecedor } = SupplierService()

  const [valorSelecionado, setValorSelecionado] = useState<string | null>(null)

  const alternarSelecaoCheckbox = (value: string) => {
    setValorSelecionado(value === valorSelecionado ? null : value)
  }

  useEffect(() => {
    if (valorSelecionado === 'antigo') {
      const sortedFornecedoresRecentes = [...fornecedores].sort((a: Supplier, b: Supplier) =>
        parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime()
      )
      setFornecedores(sortedFornecedoresRecentes)
    } else if (valorSelecionado === 'recente') {
      const sortedFornecedoresRecentes = [...fornecedores].sort((a: Supplier, b: Supplier) =>
        parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime()
      )
      setFornecedores(sortedFornecedoresRecentes)
    }
  }, [valorSelecionado])

  useEffect(() => {
    const buscarPorCnpj = async () => {
      try {
        const fornecedorResponse = await filtrarFornecedor(campoSelecionado, valorInputBuscar)
        setFornecedores(fornecedorResponse.data)
      } catch (error: any) {
        errorMessage('Erro ao tentar buscar Fornecedor.')
      } finally {
        setFoiCarregado(true)
      }
    }
    buscarPorCnpj()
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
          ) : campoSelecionado !== '' && valorInputBuscar !== '' && (
            <>
              {
                fornecedores.length === 1 ? (
                  <strong>{fornecedores.length} Fornecedor encontrado</strong>
                ) : fornecedores.length > 1 ? (
                  <strong>{fornecedores.length} Fornecedores encontrados</strong>
                ) : (
                  'Nenhum Fornecedor encontrado'
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
            ) : campoSelecionado === 'nome' ? (
              <input
                className="input-buscar"
                placeholder="Digite o Nome"
                type="search"
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'cnpj' ? (
              <CnpjInput
                className="input-buscar"
                placeholder="Digite o CNPJ"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'telefone' ? (
              <PhoneInput
                className="input-buscar"
                placeholder="Digite o Telefone"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'statusFornecedor' && (
              <>
                <div style={{ marginRight: '2vw' }}>
                  <label className="label-radio" htmlFor="opcaoStatusFornecedor1">ATIVO</label>
                  <input
                    id="opcaoStatusFornecedor1"
                    className="input-radio"
                    type="radio"
                    name="status"
                    value={campoSelecionado}
                    onChange={() => setValorInputBuscar('ATIVO')}
                  />
                </div>
                <div>
                  <label className="label-radio" htmlFor="opcaoStatusFornecedor2">INATIVO</label>
                  <input
                    id="opcaoStatusFornecedor2"
                    className="input-radio"
                    type="radio"
                    name="status"
                    value={campoSelecionado}
                    onChange={() => setValorInputBuscar('INATIVO')}
                  />
                </div>
              </>
            )
          }
        </div>
        <div className="div-radios">
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoNome">Nome</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoNome"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('nome')}
              onClick={() => handleRadioClick('nome')}
              checked={campoSelecionado === 'nome'}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoCnpj">CNPJ</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoCnpj"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('cnpj')}
              onClick={() => handleRadioClick('cnpj')}
              checked={campoSelecionado === 'cnpj'}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoTelefone">Telefone</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoTelefone"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('telefone')}
              onClick={() => handleRadioClick('telefone')}
              checked={campoSelecionado === 'telefone'}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoStatusFornecedor">Status do Fornecedor</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoStatusFornecedor"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('statusFornecedor')}
              onClick={() => handleRadioClick('statusFornecedor')}
              checked={campoSelecionado === 'statusFornecedor'}
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
          <label className="label-radio" htmlFor="antigo">Mais antigo</label>
          <input
            className="input-check"
            type="checkbox"
            name="filtroData"
            id="antigo"
            value="antigo"
            checked={valorSelecionado === 'antigo'}
            onChange={() => alternarSelecaoCheckbox('antigo')}
          />
        </div>
      </div>

      {fornecedores.map((fornecedor) => {
        return (
          <SupplierCard
            key={fornecedor.cnpj}
            supplier={fornecedor}
            setSupplier={setFornecedores}
          />
        )
      })}
    </div>
  )
}