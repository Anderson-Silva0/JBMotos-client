'use client'

import ClienteCard from "@/components/ClienteCard"
import { InputCpf, InputTelefone } from "@/components/Input"
import LoadingLogo from "@/components/LoadingLogo"
import imgCliente from "@/images/client.png"
import { parseDate } from "@/models/StringParaDate"
import { Cliente } from "@/models/cliente"
import { mensagemErro } from "@/models/toast"
import { ClienteService } from "@/services/clienteService"
import { Search } from "lucide-react"
import Image from "next/image"
import '@/styles/card.css'
import { useEffect, useState } from "react"

export default function ListarClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const [valorInputBuscar, setValorInputBuscar] = useState<string>('')

  const [campoSelecionado, setCampoSelecionado] = useState<string>('')

  const { filtrarCliente } = ClienteService()

  const [valorSelecionado, setValorSelecionado] = useState<string | null>(null)

  const alternarSelecaoCheckbox = (value: string) => {
    setValorSelecionado(value === valorSelecionado ? null : value)
  }

  useEffect(() => {
    if (valorSelecionado === 'antigo') {
      const sortedClientesRecentes = [...clientes].sort((a: Cliente, b: Cliente) =>
        parseDate(a.dataHoraCadastro).getTime() - parseDate(b.dataHoraCadastro).getTime()
      )
      setClientes(sortedClientesRecentes)
    } else if (valorSelecionado === 'recente') {
      const sortedClientesRecentes = [...clientes].sort((a: Cliente, b: Cliente) =>
        parseDate(b.dataHoraCadastro).getTime() - parseDate(a.dataHoraCadastro).getTime()
      )
      setClientes(sortedClientesRecentes)
    }
  }, [valorSelecionado])

  useEffect(() => {
    const buscarPorCpf = async () => {
      try {
        const clienteResponse = await filtrarCliente(campoSelecionado, valorInputBuscar)
        setClientes(clienteResponse.data)
      } catch (error: any) {
        mensagemErro('Erro ao tentar buscar cliente.')
      } finally {
        setFoiCarregado(true)
      }
    }
    buscarPorCpf()
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
    return <LoadingLogo descricao='Carregando' />
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        {
          campoSelecionado === '' ? (
            clientes.length > 1 ? (
              <>
                <Image src={imgCliente} width={60} height={60} alt="" /> {clientes.length} Clientes cadastrados
              </>
            ) : clientes.length === 1 ? (
              <>
                <Image src={imgCliente} width={60} height={60} alt="" /> {clientes.length} Cliente cadastrado
              </>
            ) : (
              'Nenhum Cliente cadastrado no sistema'
            )
          ) : campoSelecionado !== '' && valorInputBuscar !== '' && (
            <>
              {
                clientes.length === 1 ? (
                  <strong>{clientes.length} Cliente encontrado</strong>
                ) : clientes.length > 1 ? (
                  <strong>{clientes.length} Clientes encontrados</strong>
                ) : (
                  'Nenhum Cliente encontrado'
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
            ) : campoSelecionado === 'email' ? (
              <input
                className="input-buscar"
                placeholder="Digite o Email"
                type="search"
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'cpf' ? (
              <InputCpf
                className="input-buscar"
                placeholder="Digite o CPF"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'telefone' ? (
              <InputTelefone
                className="input-buscar"
                placeholder="Digite o Telefone"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'statusCliente' && (
              <>
                <div style={{ marginRight: '2vw' }}>
                  <label className="label-radio" htmlFor="opcaoStatusCliente1">ATIVO</label>
                  <input
                    id="opcaoStatusCliente1"
                    className="input-radio"
                    type="radio"
                    name="status"
                    value={campoSelecionado}
                    onChange={() => setValorInputBuscar('ATIVO')}
                  />
                </div>
                <div>
                  <label className="label-radio" htmlFor="opcaoStatusCliente2">INATIVO</label>
                  <input
                    id="opcaoStatusCliente2"
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
            <label className="label-radio" htmlFor="opcaoCPF">CPF</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoCPF"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('cpf')}
              onClick={() => handleRadioClick('cpf')}
              checked={campoSelecionado === 'cpf'}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoEmail">Email</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoEmail"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('email')}
              onClick={() => handleRadioClick('email')}
              checked={campoSelecionado === 'email'}
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
            <label className="label-radio" htmlFor="opcaoStatusCliente">Status do Cliente</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoStatusCliente"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('statusCliente')}
              onClick={() => handleRadioClick('statusCliente')}
              checked={campoSelecionado === 'statusCliente'}
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

      {clientes.map((cliente) => {
        return (
          <ClienteCard
            key={cliente.cpf}
            cliente={cliente}
            setClientes={setClientes}
          />
        )
      })}
    </div>
  )
}