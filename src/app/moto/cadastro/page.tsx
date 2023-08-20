'use client'

import { Card } from "@/components/Card";
import { ExibeErro } from "@/components/ExibeErro";
import { FormGroup } from "@/components/Form-group";
import { InputPlaca } from "@/components/Input";
import { OpcoesSelecoes, estadoInicialOpcoesSelecoes } from "@/models/Selecoes";
import { Cliente } from "@/models/cliente";
import { Erros } from "@/models/erros";
import { Moto, estadoInicialMoto } from "@/models/moto";
import { selectStyles } from "@/models/selectStyles";
import { mensagemErro, mensagemSucesso } from "@/models/toast";
import { ClienteService } from "@/services/clienteService";
import { MotoService } from "@/services/motoService";
import { Save } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";

export default function CadastroMoto() {
  const { salvarMoto } = MotoService()
  const { buscarTodosClientes } = ClienteService()

  const [opcaoSelecionadaCliente,
    setOpcaoSelecionadaCliente
  ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

  const [erros, setErros] = useState<Erros[]>([])

  const [moto, setMoto] = useState<Moto>(estadoInicialMoto)

  const [clientes, setClientes] = useState<Cliente[]>([])

  useEffect(() => {
    const buscarTodos = async () => {
      try {
        const todosClientesResponse = await buscarTodosClientes()
        const todosClientes = todosClientesResponse.data
        const clientesAtivos = todosClientes.filter((c: Cliente) => c.statusCliente === 'ATIVO')
        setClientes(clientesAtivos)
      } catch (erro: any) {
        mensagemErro(erro.response.data)
      }
    }
    buscarTodos()
  }, [])

  useEffect(() => {
    setMoto(
      {
        ...moto,
        cpfCliente: String(opcaoSelecionadaCliente?.value)
      }
    )
    setErros([])
  }, [opcaoSelecionadaCliente])

  const setPropsMoto = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setMoto({ ...moto, [key]: e.target.value })
    setErros([])
  }

  const submit = async () => {
    try {
      await salvarMoto(moto)
      mensagemSucesso("Moto cadastrada com sucesso!")
      setMoto(estadoInicialMoto)
      setOpcaoSelecionadaCliente(estadoInicialOpcoesSelecoes)
    } catch (erro: any) {
      mensagemErro('Erro no preenchimento dos campos.')
      salvarErros(erro)
    }
  }

  const salvarErros = (erro: any) => {
    const objErro = erro.response.data
    const keys = Object.keys(objErro)
    if (!objErro.error && erros.length <= 8) {
      setErros((errosAntigos) => {
        const novosErros = keys.map((k) => ({ nomeInput: k, mensagemErro: objErro[k] }))
        return [...errosAntigos, ...novosErros]
      })
    }
    const erroIgnorado = "Endereço não encontrado para o Id informado."
    if (objErro.error && objErro.error !== erroIgnorado) {
      setErros((errosAntigos) => [...errosAntigos, { nomeInput: 'error', mensagemErro: objErro.error }])
    }
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        <Save size='6vh' strokeWidth={3} /> Cadastro de Moto
      </h1>
      <Card titulo="Dados da Moto">
        <FormGroup label="Placa: *" htmlFor="placa">
          <InputPlaca
            value={moto.placa}
            onChange={(e) => setPropsMoto('placa', e)}
            id="placa"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='placa' />}
        </FormGroup>
        <FormGroup label="Marca: *" htmlFor="marca">
          <input
            value={moto.marca}
            onChange={e => setPropsMoto("marca", e)}
            id="marca"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='marca' />}
        </FormGroup>
        <FormGroup label="Modelo: *" htmlFor="modelo">
          <input
            value={moto.modelo}
            onChange={e => setPropsMoto("modelo", e)}
            id="modelo"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='modelo' />}
        </FormGroup>
        <FormGroup label="Ano: *" htmlFor="ano">
          <input
            className='input-number-form'
            value={moto.ano}
            onChange={e => setPropsMoto("ano", e)}
            id="ano"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<ExibeErro erros={erros} nomeInput='ano' />}
        </FormGroup>
        <FormGroup label="Selecione o Cliente: *" htmlFor="cpfCliente">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={opcaoSelecionadaCliente}
            onChange={(option: any) => setOpcaoSelecionadaCliente(option)}
            options={clientes.map(c => ({ label: c.cpf, value: c.cpf }) as OpcoesSelecoes)}
            instanceId="select-cpfCliente"
          />
          {<ExibeErro erros={erros} nomeInput="cpfCliente" />}
        </FormGroup>
      </Card>
      <div className="divBotaoCadastrar">
        <button
          onClick={submit}
          type="submit">
          Cadastrar Moto
        </button>
      </div>
    </div>
  )
}