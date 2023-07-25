'use client'

import ClienteCard from "@/components/ClienteCard"
import { Cliente } from "@/models/cliente"
import { mensagemErro } from "@/models/toast"
import { ClienteService } from "@/services/clienteService"
import Image from "next/image"
import { useState, useEffect } from "react"
import imgCliente from "@/images/client.png"
import { InputCpf, InputTelefone } from "@/components/Input"
import { Search } from "lucide-react"

export default function ListarClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const [valorInputBuscar, setValorInputBuscar] = useState<string>('')

  const [campoSelecionado, setCampoSelecionado] = useState<string>('')

  const { filtrarCliente } = ClienteService()

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
                <p>Selecione uma opção de busca:</p>
                <p>Nome, CPF, Email ou Telefone.</p>
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