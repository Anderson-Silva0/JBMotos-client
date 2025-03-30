'use client'

import { CpfInput, PlateInput } from "@/components/Input"
import LoadingLogo from "@/components/LoadingLogo"
import MotorcycleCard from "@/components/MotoCard"
import imgMoto from "@/images/moto.png"
import { parseDate } from "@/models/StringParaDate"
import { Motorcycle } from "@/models/moto"
import { errorMessage } from "@/models/toast"
import { MotorcycleService } from "@/services/motoService"
import { Search } from "lucide-react"
import Image from "next/image"
import '@/styles/card.css'
import { useEffect, useState } from "react"

export default function ListarMotos() {
  const [motos, setMotos] = useState<Motorcycle[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const [valorInputBuscar, setValorInputBuscar] = useState<string>('')

  const [campoSelecionado, setCampoSelecionado] = useState<string>('')

  const { filterMotorcycle: filtrarMoto } = MotorcycleService()

  const [valorSelecionado, setValorSelecionado] = useState<string | null>(null)

  const alternarSelecaoCheckbox = (value: string) => {
    setValorSelecionado(value === valorSelecionado ? null : value)
  }

  useEffect(() => {
    if (valorSelecionado === 'antiga') {
      const sortedProdutosRecentes = [...motos].sort((a: Motorcycle, b: Motorcycle) =>
        parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime()
      )
      setMotos(sortedProdutosRecentes)
    } else if (valorSelecionado === 'recente') {
      const sortedProdutosRecentes = [...motos].sort((a: Motorcycle, b: Motorcycle) =>
        parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime()
      )
      setMotos(sortedProdutosRecentes)
    }
  }, [valorSelecionado])

  useEffect(() => {
    const buscarPorId = async () => {
      try {
        const motoResponse = await filtrarMoto(campoSelecionado, valorInputBuscar)
        setMotos(motoResponse.data)
      } catch (error: any) {
        errorMessage('Erro ao tentar buscar Moto.')
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
    return <LoadingLogo description='Carregando' />
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        {
          campoSelecionado === '' ? (
            motos.length > 1 ? (
              <>
                <Image src={imgMoto} width={60} height={60} alt="" /> {motos.length} Motos cadastradas
              </>
            ) : motos.length === 1 ? (
              <>
                <Image src={imgMoto} width={60} height={60} alt="" /> {motos.length} Moto cadastrada
              </>
            ) : (
              'Nenhuma Moto cadastrada no sistema'
            )
          ) : campoSelecionado !== '' && valorInputBuscar !== '' && (
            <>
              {
                motos.length === 1 ? (
                  <strong>{motos.length} Moto encontrada</strong>
                ) : motos.length > 1 ? (
                  <strong>{motos.length} Motos encontradas</strong>
                ) : (
                  'Nenhuma Moto encontrada'
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
            ) : campoSelecionado === 'placa' ? (
              <PlateInput
                className="input-buscar"
                placeholder="Digite a Placa"
                type="search"
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'marca' ? (
              <input
                className="input-buscar"
                placeholder="Digite a Marca"
                type="search"
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'modelo' ? (
              <input
                className="input-buscar"
                placeholder="Digite o Modelo"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'cpfCliente' ? (
              <CpfInput
                className="input-buscar"
                placeholder="Digite o CPF do Cliente"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
            ) : campoSelecionado === 'statusMoto' && (
              <>
                <div style={{ marginRight: '2vw' }}>
                  <label className="label-radio" htmlFor="opcaoStatusMoto1">ATIVO</label>
                  <input
                    id="opcaoStatusMoto1"
                    className="input-radio"
                    type="radio"
                    name="status"
                    value={campoSelecionado}
                    onChange={() => setValorInputBuscar('ATIVO')}
                  />
                </div>
                <div>
                  <label className="label-radio" htmlFor="opcaoStatusMoto2">INATIVO</label>
                  <input
                    id="opcaoStatusMoto2"
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
            <label className="label-radio" htmlFor="opcaoPlaca">Placa</label>
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
            <label className="label-radio" htmlFor="opcaoModelo">Modelo</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoModelo"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('modelo')}
              onClick={() => handleRadioClick('modelo')}
              checked={campoSelecionado === 'modelo'}
            />
          </div>
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
            <label className="label-radio" htmlFor="opcaoStatusMoto">Status da Moto</label>
            <input
              className="input-radio"
              type="radio"
              name="opcao"
              id="opcaoStatusMoto"
              value={campoSelecionado}
              onChange={() => setCampoSelecionado('statusMoto')}
              onClick={() => handleRadioClick('statusMoto')}
              checked={campoSelecionado === 'statusMoto'}
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

      {motos.map((moto) => {
        return (
          <MotorcycleCard
            key={moto.id}
            motorcycle={moto}
            setMotorcycle={setMotos}
          />
        )
      })}
    </div>
  )
}