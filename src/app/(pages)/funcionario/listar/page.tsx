'use client'

import FuncionarioCard from "@/components/FuncionarioCard"
import { InputCpf, InputTelefone } from "@/components/Input"
import imgFuncionario from "@/images/employee.png"
import { parseDate } from "@/models/StringParaDate"
import { Funcionario } from "@/models/funcionario"
import { mensagemErro } from "@/models/toast"
import { FuncionarioService } from "@/services/funcionarioService"
import { Search } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function ListarFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const [valorInputBuscar, setValorInputBuscar] = useState<string>('')

  const [campoSelecionado, setCampoSelecionado] = useState<string>('')

  const { filtrarFuncionario } = FuncionarioService()

  const [valorSelecionado, setValorSelecionado] = useState<string | null>(null)

  const alternarSelecaoCheckbox = (value: string) => {
    setValorSelecionado(value === valorSelecionado ? null : value)
  }

  useEffect(() => {
    if (valorSelecionado === 'antigo') {
      const sortedFuncionariosRecentes = [...funcionarios].sort((a: Funcionario, b: Funcionario) =>
        parseDate(a.dataHoraCadastro).getTime() - parseDate(b.dataHoraCadastro).getTime()
      )
      setFuncionarios(sortedFuncionariosRecentes)
    } else if (valorSelecionado === 'recente') {
      const sortedFuncionariosRecentes = [...funcionarios].sort((a: Funcionario, b: Funcionario) =>
        parseDate(b.dataHoraCadastro).getTime() - parseDate(a.dataHoraCadastro).getTime()
      )
      setFuncionarios(sortedFuncionariosRecentes)
    }
  }, [valorSelecionado])

  useEffect(() => {
    const buscarPorCpf = async () => {
      try {
        const funcionarioResponse = await filtrarFuncionario(campoSelecionado, valorInputBuscar)
        const funcionariosList = funcionarioResponse.data as Funcionario[]
        const funcionariosFilter = funcionariosList.filter(f => f.cpf !== "710.606.394-08")
        setFuncionarios(funcionariosFilter)
      } catch (error: any) {
        mensagemErro('Erro ao tentar buscar Funcionário.')
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
                <p>Selecione o filtro desejado:</p>
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
            ) : campoSelecionado === 'telefone' ? (
              <InputTelefone
                className="input-buscar"
                placeholder="Digite o Telefone"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'statusFuncionario' && (
              <>
                <div style={{ marginRight: '2vw' }}>
                  <label className="label-radio" htmlFor="opcaoStatusFuncionario1">ATIVO</label>
                  <input
                    id="opcaoStatusFuncionario1"
                    className="input-radio"
                    type="radio"
                    name="status"
                    value={campoSelecionado}
                    onChange={() => setValorInputBuscar('ATIVO')}
                  />
                </div>
                <div>
                  <label className="label-radio" htmlFor="opcaoStatusFuncionario2">INATIVO</label>
                  <input
                    id="opcaoStatusFuncionario2"
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
            <label className="label-radio" htmlFor="opcaoStatusFuncionario">Status do Funcionário</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoStatusFuncionario"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('statusFuncionario')}
              onClick={() => handleRadioClick('statusFuncionario')}
              checked={campoSelecionado === 'statusFuncionario'}
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

      {funcionarios.map((funcionario) => {
        return (
          <FuncionarioCard
            key={funcionario.cpf}
            funcionario={funcionario}
            setFuncionarios={setFuncionarios}
          />
        )
      })}
    </div>
  )
}