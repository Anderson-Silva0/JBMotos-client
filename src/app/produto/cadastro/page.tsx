'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { Card } from '@/components/Card'
import { FormGroup } from '@/components/Form-group'
import { mensagemErro, mensagemSucesso } from '../../../models/toast'
import { Produto, estadoInicialProduto } from '../../../models/produto'
import { Estoque, estadoInicialEstoque } from '@/models/estoque'
import { ProdutoService } from '../../../services/produtoService'
import { FornecedorService } from '../../../services/fornecedorService'
import { ExibeErro } from '@/components/ExibeErro'
import { Erros } from '@/models/erros'
import { EstoqueService } from '@/services/estoqueService'
import { Fornecedor } from '@/models/fornecedor'

export default function CadastroProduto() {

  const {
    salvarProduto
  } = ProdutoService()

  const {
    salvarEstoque,
    deletarEstoque
  } = EstoqueService()

  const { buscarTodosFornecedores } = FornecedorService()

  const [erros, setErros] = useState<Erros[]>([])

  const [estoque, setEstoque] = useState<Estoque>(estadoInicialEstoque)

  const [produto, setProduto] = useState<Produto>(estadoInicialProduto)

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])

  const formatCurrency = (value: number | string): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const setPropsProdutoMoney = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/\D/g, '')) / 100
    const limitedValue = Math.min(value, 100000)
    setProduto({ ...produto, [key]: limitedValue })
    console.log(limitedValue)
    setErros([])
  }

  const setPropsProduto = (key: string, e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    if (key === 'cnpjFornecedor' && e.target.value === 'Selecione...') {
      setProduto({ ...produto, [key]: '' })
    } else {
      setProduto({ ...produto, [key]: e.target.value })
    }

    setErros([])
  }

  const setPropsEstoque = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setEstoque({ ...estoque, [key]: e.target.value })

    setErros([])
  }

  useEffect(() => {
    const buscarFornecedores = async () => {
      try {
        const response = await buscarTodosFornecedores()
        setFornecedores(response.data)
      } catch (erro: any) {
        mensagemErro(erro.response.data)
      }
    }
    buscarFornecedores()
  }, [])

  const exibirErrosProduto = async () => {
    if (erros.length > 0) {
      setErros([])
    }
    try {
      await salvarProduto(produto)
    } catch (error) {
      salvarErros(error)
    }
  }

  const submit = async () => {
    try {
      await exibirErrosProduto()
      const responseEstoque = await salvarEstoque(estoque)
      setEstoque({ ...estoque, id: responseEstoque.data.id })
      setProduto({ ...produto, idEstoque: responseEstoque.data.id })
    } catch (erro: any) {
      salvarErros(erro)
    }
  }

  const salvarErros = (erro: any) => {
    const objErro = erro.response.data
    const keys = Object.keys(objErro)
    if (!objErro.error && erros.length <= 8) {
      setErros((errosAntigos) => {
        const novosErros = keys.map((k) => ({ nomeInput: k, mensagemErro: objErro[k] }));
        return [...errosAntigos, ...novosErros];
      });
    }
    if (objErro.error) {
      setErros((errosAntigos) => [...errosAntigos, { nomeInput: 'error', mensagemErro: objErro.error }])
    }
  }

  useEffect(() => {
    const salvarProdutoAtualizado = async () => {
      try {
        await salvarProduto(produto)
        mensagemSucesso("Produto cadastrado no estoque com sucesso!")
        setProduto(estadoInicialProduto)
        setEstoque(estadoInicialEstoque)
      } catch (erro: any) {
        salvarErros(erro)
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
    <div id="div-0">
      <div id="div-1">
        <Card titulo="Informações do Produto">
          <form >
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
                value={formatCurrency(produto.precoCusto)}
                onChange={(e) => setPropsProdutoMoney('precoCusto', e)}
                id="precoCusto"
                type="text"
              />
              {<ExibeErro erros={erros} nomeInput='precoCusto' />}
            </FormGroup>

            <FormGroup label="Preço de Venda: *" htmlFor="precoVenda">
              <input
                value={formatCurrency(produto.precoVenda)}
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

            <FormGroup label="Selecione o Fornecedor: *" htmlFor="fornecedor">
              <select value={produto.cnpjFornecedor} id="cnpjFornecedor"
                onChange={(e) => setPropsProduto("cnpjFornecedor", e)}
              >
                <option>Selecione...</option>
                {fornecedores.map((fornecedor) => {
                  return (
                    <option key={fornecedor.cnpj} value={fornecedor.cnpj}>
                      {fornecedor.nome}
                    </option>
                  )
                })}
              </select>
              {<ExibeErro erros={erros} nomeInput='cnpjFornecedor' />}
            </FormGroup>

            <FormGroup label="Estoque Mínimo: *" htmlFor="estoqueMinimo">
              <input
                value={estoque.estoqueMinimo}
                onChange={e => setPropsEstoque("estoqueMinimo", e)}
                id="marca"
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
              />
              {<ExibeErro erros={erros} nomeInput='estoqueMinimo' />}
            </FormGroup>

            <FormGroup label="Estoque Máximo: *" htmlFor="estoqueMaximo">
              <input
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
                value={estoque.quantidade}
                onChange={e => setPropsEstoque("quantidade", e)}
                id="quantidade"
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
              />
              {<ExibeErro erros={erros} nomeInput='quantidade' />}
            </FormGroup>
          </form>
        </Card>
      </div>

      <div className="divBotaoCadastrar">
        <button
          onClick={submit}
          type="submit">
          Cadastrar Produto
        </button>
      </div>
    </div >
  )
}