'use client'

import { InputCpf, InputPlaca } from "@/components/Input"
import ServicoCard from "@/components/ServicoCard"
import imgVenda from "@/images/vendas.png"
import { Servico } from "@/models/servico"
import { parseDate } from "@/models/StringParaDate"
import { mensagemErro } from "@/models/toast"
import { ServicoService } from "@/services/servicoService"
import { Search } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function ListarServicos() {
  const { filtrarServico } = ServicoService()

  const [servicos, setServicos] = useState<Servico[]>([])
  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)
  const [valorInputBuscar, setValorInputBuscar] = useState<string>('')
  const [campoSelecionado, setCampoSelecionado] = useState<string>('')
  const [valorSelecionado, setValorSelecionado] = useState<string | null>(null)

  const alternarSelecaoCheckbox = (value: string) => {
    setValorSelecionado(value === valorSelecionado ? null : value)
  }

  useEffect(() => {
    if (valorSelecionado === 'antiga') {
      const sortedVendasRecentes = [...servicos].sort((a: Servico, b: Servico) =>
        parseDate(a.dataHoraCadastro).getTime() - parseDate(b.dataHoraCadastro).getTime()
      )
      setServicos(sortedVendasRecentes)
    } else if (valorSelecionado === 'recente') {
      const sortedVendasRecentes = [...servicos].sort((a: Servico, b: Servico) =>
        parseDate(b.dataHoraCadastro).getTime() - parseDate(a.dataHoraCadastro).getTime()
      )
      setServicos(sortedVendasRecentes)
    }
  }, [valorSelecionado])

  useEffect(() => {
    const buscarPorId = async () => {
      try {
        const servicoResponse = await filtrarServico(campoSelecionado, valorInputBuscar)
        setServicos(servicoResponse.data)
      } catch (error: any) {
        mensagemErro('Erro ao tentar buscar Serviço.')
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
            servicos.length > 1 ? (
              <>
                <Image src={imgVenda} width={60} height={60} alt="" /> {servicos.length} Serviços Realizados
              </>
            ) : servicos.length === 1 ? (
              <>
                <Image src={imgVenda} width={60} height={60} alt="" /> {servicos.length} Serviço Realizado
              </>
            ) : (
              'Nenhum Serviço realizado no sistema'
            )
          ) : campoSelecionado !== '' && valorInputBuscar !== '' && (
            <>
              {
                servicos.length === 1 ? (
                  <strong>{servicos.length} Serviço encontrado</strong>
                ) : servicos.length > 1 ? (
                  <strong>{servicos.length} Serviços encontrados</strong>
                ) : (
                  'Nenhum Serviço encontrado'
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
              <InputCpf
                className="input-buscar"
                placeholder="Digite o CPF"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'cpfFuncionario' ? (
              <InputCpf
                className="input-buscar"
                placeholder="Digite o CPF"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'placa' ? (
              <InputPlaca
                className="input-buscar"
                placeholder="Digite o Placa"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'servicosRealizados' && (
              <input
                className="input-buscar"
                placeholder="Digite algum Serviço"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            )
          }
        </div>
        <div className="div-radios">
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoCpfCliente">CPF do Cliente</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoCpfCliente"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('cpfCliente')}
              onClick={() => handleRadioClick('cpfCliente')}
              checked={campoSelecionado === 'cpfCliente'}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoCpfFuncionario">CPF do Funcionário</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoCpfFuncionario"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('cpfFuncionario')}
              onClick={() => handleRadioClick('cpfFuncionario')}
              checked={campoSelecionado === 'cpfFuncionario'}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoPlaca">Placa da Moto</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoPlaca"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('placa')}
              onClick={() => handleRadioClick('placa')}
              checked={campoSelecionado === 'placa'}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoRealizados">Serviços Realizados</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoRealizados"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('servicosRealizados')}
              onClick={() => handleRadioClick('servicosRealizados')}
              checked={campoSelecionado === 'servicosRealizados'}
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

      {servicos.map((servico) => {
        return (
          <ServicoCard key={servico.id}
            id={servico.id}
            cpfFuncionario={servico.cpfFuncionario}
            dataHoraCadastro={servico.dataHoraCadastro}
            observacao={servico.observacao}
            precoMaoDeObra={servico.precoMaoDeObra}
            servicosRealizados={servico.servicosRealizados}
            venda={servico.venda}
            moto={servico.moto}
          />
        )
      })}
    </div>
  )
}