'use client'

import { Card } from '@/components/Card'
import { ExibeErro } from '@/components/ExibeErro'
import { FormGroup } from '@/components/Form-group'
import { OpcoesSelecoes, estadoInicialOpcoesSelecoes } from '@/models/Selecoes'
import { Erros, salvarErros } from '@/models/erros'
import { Estoque, estadoInicialEstoque } from '@/models/estoque'
import { formatarParaReal } from '@/models/formatadorReal'
import { Fornecedor } from '@/models/fornecedor'
import { Produto, estadoInicialProduto } from '@/models/produto'
import { selectStyles } from '@/models/selectStyles'
import { mensagemErro, mensagemSucesso } from '@/models/toast'
import { EstoqueService } from '@/services/estoqueService'
import { FornecedorService } from '@/services/fornecedorService'
import { ProdutoService } from '@/services/produtoService'
import { ChangeEvent, useEffect, useState } from 'react'
import Select from 'react-select'

export default function CadastroProduto() {
  const { salvarProduto } = ProdutoService()

  const { salvarEstoque, deletarEstoque } = EstoqueService()

  const { buscarTodosFornecedores } = FornecedorService()

  const [erros, setErros] = useState<Erros[]>([])

  const [estoque, setEstoque] = useState<Estoque>(estadoInicialEstoque)

  const [produto, setProduto] = useState<Produto>(estadoInicialProduto)

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])

  const [
    opcaoSelecionadaFornecedor,
    setOpcaoSelecionadaFornecedor
  ] = useState<OpcoesSelecoes>(estadoInicialOpcoesSelecoes)

  const setPropsProdutoMoney = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/\D/g, '')) / 100
    const limitedValue = Math.min(value, 100000)
    setProduto({ ...produto, [key]: limitedValue })
    setErros([])
  }

  const setPropsProduto = (key: string, e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    setProduto({ ...produto, [key]: e.target.value })
    setErros([])
  }

  const setPropsEstoque = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEstoque({ ...estoque, [key]: e.target.value })
    setErros([])
  }

  useEffect(() => {
    const buscarFornecedores = async () => {
      try {
        const todosFornecedoresResponse = await buscarTodosFornecedores()
        const todosFornecedores = todosFornecedoresResponse.data
        const fornecedoresAtivos = todosFornecedores.filter((f: Fornecedor) => f.statusFornecedor === 'ATIVO')
        setFornecedores(fornecedoresAtivos)
      } catch (erro: any) {
        mensagemErro(erro.response.data)
      }
    }
    buscarFornecedores()
  }, [])

  useEffect(() => {
    setProduto(
      { ...produto, cnpjFornecedor: String(opcaoSelecionadaFornecedor?.value) }
    )
    setErros([])
  }, [opcaoSelecionadaFornecedor])

  const exibirErrosProduto = async () => {
    if (erros.length > 0) {
      setErros([])
    }
    try {
      await salvarProduto(produto)
    } catch (error) {
      salvarErros(error, erros, setErros)
    }
  }

  const submit = async () => {
    await exibirErrosProduto()
    try {
      const responseEstoque = await salvarEstoque(estoque)
      setEstoque({ ...estoque, id: responseEstoque.data.id })
      setProduto({ ...produto, idEstoque: responseEstoque.data.id })
    } catch (error: any) {
      salvarErros(error, erros, setErros)
      mensagemErro('Erro no preenchimento dos campos.')
    }
  }

  useEffect(() => {
    const salvarProdutoAtualizado = async () => {
      try {
        await salvarProduto(produto)
        mensagemSucesso("Produto cadastrado no estoque com sucesso!")
        setProduto(estadoInicialProduto)
        setOpcaoSelecionadaFornecedor(estadoInicialOpcoesSelecoes)
        setEstoque(estadoInicialEstoque)
      } catch (erro: any) {
        mensagemErro('Erro no preenchimento dos campos.')
        erros.map(e => e.nomeInput === 'error' && mensagemErro(e.mensagemErro))
        await deletarEstoque(estoque.id)
        setEstoque({ ...estoque, id: 0 })
        setProduto({ ...produto, idEstoque: 0 })
      }
    }
    if (estoque.id !== 0) {
      salvarProdutoAtualizado()
    }
  }, [estoque.id])

  return (
    <div className='div-form-container'>
      <Card titulo="Informações do Produto">
        <FormGroup label="Nome: *" htmlFor="nome">
          <input
            value={produto.nome}
            onChange={e => setPropsProduto("nome", e)}
            id="nome"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='nome' />}
        </FormGroup>
        <FormGroup label="Preço de Custo: *" htmlFor="precoCusto">
          <input
            value={formatarParaReal(produto.precoCusto)}
            onChange={(e) => setPropsProdutoMoney('precoCusto', e)}
            id="precoCusto"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='precoCusto' />}
        </FormGroup>
        <FormGroup label="Preço de Venda: *" htmlFor="precoVenda">
          <input
            value={formatarParaReal(produto.precoVenda)}
            onChange={(e) => setPropsProdutoMoney('precoVenda', e)}
            id="precoVenda"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='precoVenda' />}
        </FormGroup>
        <FormGroup label="Marca: *" htmlFor="marca">
          <input
            value={produto.marca}
            onChange={e => setPropsProduto("marca", e)}
            id="marca"
            type="text"
          />
          {<ExibeErro erros={erros} nomeInput='marca' />}
        </FormGroup>
        <FormGroup label="Selecione o Fornecedor: *" htmlFor="cnpjFornecedor">
          <Select
            styles={selectStyles}
            placeholder="Selecione..."
            value={opcaoSelecionadaFornecedor}
            onChange={(option: any) => setOpcaoSelecionadaFornecedor(option)}
            options={fornecedores.map(fornecedor => (
              { label: fornecedor.nome, value: fornecedor.cnpj }
            ) as OpcoesSelecoes)}
            instanceId="select-cnpjFornecedor"
          />
          {<ExibeErro erros={erros} nomeInput="cnpjFornecedor" />}
        </FormGroup>
        <FormGroup label="Estoque Mínimo: *" htmlFor="estoqueMinimo">
          <input
            className="input-number-form"
            value={estoque.estoqueMinimo}
            onChange={e => setPropsEstoque("estoqueMinimo", e)}
            id="estoqueMinimo"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<ExibeErro erros={erros} nomeInput='estoqueMinimo' />}
        </FormGroup>
        <FormGroup label="Estoque Máximo: *" htmlFor="estoqueMaximo">
          <input
            className="input-number-form"
            value={estoque.estoqueMaximo}
            onChange={e => setPropsEstoque("estoqueMaximo", e)}
            id="estoqueMaximo"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<ExibeErro erros={erros} nomeInput='estoqueMaximo' />}
        </FormGroup>
        <FormGroup label="Quantidade: *" htmlFor="quantidade">
          <input
            className="input-number-form"
            value={estoque.quantidade}
            onChange={e => setPropsEstoque("quantidade", e)}
            id="quantidade"
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {<ExibeErro erros={erros} nomeInput='quantidade' />}
        </FormGroup>
      </Card>
      <div className="divBotaoCadastrar">
        <button
          onClick={submit}
          type="submit">
          Cadastrar Produto
        </button>
      </div>
    </div>
  )
}