'use client'

import LoadingLogo from "@/components/LoadingLogo"
import ProdutoCard from "@/components/ProdutoCard"
import imgProduto from '@/images/checklist.png'
import { parseDate } from "@/models/StringParaDate"
import { Produto } from "@/models/produto"
import { mensagemErro } from "@/models/toast"
import { ProdutoService } from "@/services/produtoService"
import { Search } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function ListarProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const [valorInputBuscar, setValorInputBuscar] = useState<string>('')

  const [campoSelecionado, setCampoSelecionado] = useState<string>('')

  const { filtrarProduto } = ProdutoService()

  const [valorSelecionado, setValorSelecionado] = useState<string | null>(null)

  const alternarSelecaoCheckbox = (value: string) => {
    setValorSelecionado(value === valorSelecionado ? null : value)
  }

  useEffect(() => {
    if (valorSelecionado === 'antigo') {
      const sortedProdutosRecentes = [...produtos].sort((a: Produto, b: Produto) =>
        parseDate(a.dataHoraCadastro).getTime() - parseDate(b.dataHoraCadastro).getTime()
      )
      setProdutos(sortedProdutosRecentes)
    } else if (valorSelecionado === 'recente') {
      const sortedProdutosRecentes = [...produtos].sort((a: Produto, b: Produto) =>
        parseDate(b.dataHoraCadastro).getTime() - parseDate(a.dataHoraCadastro).getTime()
      )
      setProdutos(sortedProdutosRecentes)
    }
  }, [valorSelecionado])

  useEffect(() => {
    const buscarPorId = async () => {
      try {
        const produtoResponse = await filtrarProduto(campoSelecionado, valorInputBuscar)
        setProdutos(produtoResponse.data)
      } catch (error: any) {
        mensagemErro('Erro ao tentar buscar Produto.')
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
    return <LoadingLogo />
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        {
          campoSelecionado === '' ? (
            produtos.length > 1 ? (
              <>
                <Image src={imgProduto} width={60} height={60} alt="" /> {produtos.length} Produtos cadastrados
              </>
            ) : produtos.length === 1 ? (
              <>
                <Image src={imgProduto} width={60} height={60} alt="" /> {produtos.length} Produto cadastrado
              </>
            ) : (
              'Nenhum Produto cadastrado no sistema'
            )
          ) : campoSelecionado !== '' && valorInputBuscar !== '' && (
            <>
              {
                produtos.length === 1 ? (
                  <strong>{produtos.length} Produto encontrado</strong>
                ) : produtos.length > 1 ? (
                  <strong>{produtos.length} Produtos encontrados</strong>
                ) : (
                  'Nenhum Produto encontrado'
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
            ) : campoSelecionado === 'marca' ? (
              <input
                className="input-buscar"
                placeholder="Digite a marca"
                type="search"
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'statusProduto' && (
              <>
                <div style={{ marginRight: '2vw' }}>
                  <label className="label-radio" htmlFor="opcaoStatusProduto1">ATIVO</label>
                  <input
                    id="opcaoStatusProduto1"
                    className="input-radio"
                    type="radio"
                    name="status"
                    value={campoSelecionado}
                    onChange={() => setValorInputBuscar('ATIVO')}
                  />
                </div>
                <div>
                  <label className="label-radio" htmlFor="opcaoStatusProduto2">INATIVO</label>
                  <input
                    id="opcaoStatusProduto2"
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
            <label className="label-radio" htmlFor="opcaoMarca">Marca</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoMarca"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('marca')}
              onClick={() => handleRadioClick('marca')}
              checked={campoSelecionado === 'marca'}
            />
          </div>
          <div className="div-dupla-radio">
            <label className="label-radio" htmlFor="opcaoStatusProduto">Status do Produto</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoStatusProduto"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('statusProduto')}
              onClick={() => handleRadioClick('statusProduto')}
              checked={campoSelecionado === 'statusProduto'}
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

      {produtos.map((produto) => {
        return (
          <ProdutoCard
            key={produto.id}
            produto={produto}
            setProdutos={setProdutos}
          />
        )
      })}
    </div>
  );
}