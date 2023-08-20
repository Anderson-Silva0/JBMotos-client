'use client'

import { InputCpf, InputPlaca } from "@/components/Input"
import MotoCard from "@/components/MotoCard"
import imgMoto from "@/images/moto.png"
import { Moto } from "@/models/moto"
import { mensagemErro } from "@/models/toast"
import { MotoService } from "@/services/motoService"
import { Search } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function ListarMotos() {
  const [motos, setMotos] = useState<Moto[]>([])

  const [foiCarregado, setFoiCarregado] = useState<boolean>(false)

  const [valorInputBuscar, setValorInputBuscar] = useState<string>('')

  const [campoSelecionado, setCampoSelecionado] = useState<string>('')

  const { filtrarMoto } = MotoService()

  useEffect(() => {
    const buscarPorId = async () => {
      try {
        const motoResponse = await filtrarMoto(campoSelecionado, valorInputBuscar)
        setMotos(motoResponse.data)
      } catch (error: any) {
        mensagemErro('Erro ao tentar buscar Moto.')
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
                <p>Selecione uma opção de busca:</p>
                <p>Placa, Marca, Modelo ou CPF do Cliente.</p>
              </div>
            ) : campoSelecionado === 'placa' ? (
              <InputPlaca
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
            ) : campoSelecionado === 'cpfCliente' && (
              <InputCpf
                className="input-buscar"
                placeholder="Digite o CPF do Cliente"
                type="search"
                value={valorInputBuscar}
                onChange={(e) => setValorInputBuscar(e.target.value)}
              />
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
        </div>
      </div>
      {motos.map((moto) => {
        return (
          <MotoCard
            key={moto.id}
            moto={moto}
            setMotos={setMotos}
          />
        )
      })}
    </div>
  )
}