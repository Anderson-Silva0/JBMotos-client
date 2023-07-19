'use client'

import FuncionarioCard from "@/components/FuncionarioCard"
import { Funcionario } from "@/models/funcionario"
import { mensagemErro } from "@/models/toast"
import { FuncionarioService } from "@/services/funcionarioService"
import Image from "next/image"
import { useState, useEffect } from "react"
import imgFuncionario from "@/images/employee.png"
import { Search } from "lucide-react"
import { InputCpf, InputTelefone } from "@/components/Input"

export default function ListarFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const [valorInputBuscar, setValorInputBuscar] = useState<string>('')

  const [campoSelecionado, setCampoSelecionado] = useState<string>('')

  const { filtrarFuncionario } = FuncionarioService()

  useEffect(() => {
    const buscarPorCpf = async () => {
      try {
        const clienteResponse = await filtrarFuncionario(campoSelecionado, valorInputBuscar)
        setFuncionarios(clienteResponse.data)
      } catch (error: any) {
        mensagemErro('Erro ao tentar buscar funcionário.')
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
            funcionarios.length > 1 ? (
              <>
                <Image src={imgFuncionario} width={60} height={60} alt="" /> {funcionarios.length} Funcionários cadastrados
              </>
            ) : funcionarios.length === 1 ? (
              <>
                <Image src={imgFuncionario} width={60} height={60} alt="" /> {funcionarios.length} Funcionário cadastrado
              </>
            ) : (
              'Nenhum Funcionário cadastrado no sistema'
            )
          ) : campoSelecionado !== '' && valorInputBuscar !== '' && (
            <>
              {
                funcionarios.length === 1 ? (
                  <strong>{funcionarios.length} Funcionário encontrado</strong>
                ) : funcionarios.length > 1 ? (
                  <strong>{funcionarios.length} Funcionários encontrados</strong>
                ) : (
                  'Nenhum Funcionário encontrado'
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
                <p>Nome, CPF ou Telefone.</p>
              </div>
            ) : campoSelecionado === 'nome' ? (
              <input
                className="input-buscar"
                placeholder="Digite o Nome"
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

      {funcionarios.map((funcionario) => {
        return (
          <FuncionarioCard
            key={funcionario.cpf}
            funcionario={funcionario}
            funcionarios={funcionarios}
            setFuncionarios={setFuncionarios}
          />
        )
      })}
    </div>
  )
}