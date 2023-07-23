'use client'

import FornecedorCard from "@/components/FornecedorCard"
import { Fornecedor } from "@/models/fornecedor"
import { mensagemErro } from "@/models/toast"
import { FornecedorService } from "@/services/fornecedorService"
import Image from "next/image"
import { useState, useEffect } from "react"
import imgFornecedor from "@/images/supplier.png"
import { Search } from "lucide-react"
import { InputCnpj, InputTelefone } from "@/components/Input"

export default function ListarFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const [valorInputBuscar, setValorInputBuscar] = useState<string>('')

  const [campoSelecionado, setCampoSelecionado] = useState<string>('')

  const { filtrarFornecedor } = FornecedorService()

  useEffect(() => {
    const buscarPorCnpj = async () => {
      try {
        const fornecedorResponse = await filtrarFornecedor(campoSelecionado, valorInputBuscar)
        setFornecedores(fornecedorResponse.data)
      } catch (error: any) {
        mensagemErro('Erro ao tentar buscar Fornecedor.')
      } finally {
        setFoiCarregado(true)
      }
    }
    buscarPorCnpj()
  }, [valorInputBuscar, campoSelecionado])

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
                <p>Selecione uma opção de busca:</p>
                <p>Nome, CNPJ ou Telefone.</p>
              </div>
            ) : campoSelecionado === 'nome' ? (
              <input
                className="input-buscar"
                placeholder="Digite o Nome"
                type="search"
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'cnpj' ? (
              <InputCnpj
                className="input-buscar"
                placeholder="Digite o CNPJ"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'telefone' && (
              <InputTelefone
                className="input-buscar"
                placeholder="Digite o Telefone"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
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
        </div>
      </div>

      {fornecedores.map((fornecedor) => {
        return (
          <FornecedorCard
            key={fornecedor.cnpj}
            fornecedor={fornecedor}
            setFornecedores={setFornecedores}
          />
        )
      })}
    </div>
  )
}