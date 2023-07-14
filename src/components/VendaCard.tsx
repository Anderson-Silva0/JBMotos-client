import '@/styles/cardListagem.css'
import { useRouter } from 'next/navigation'

import { Pedido } from '@/models/pedido'
import { ClienteService } from '@/services/clienteService'
import { Cliente, estadoInicialCliente } from '@/models/cliente'
import { useEffect, useState } from 'react'
import { mensagemErro } from '@/models/toast'
import { Funcionario, estadoInicialFuncionario } from '@/models/funcionario'
import { FuncionarioService } from '@/services/funcionarioService'

export default function VendaCard(pedido: Pedido) {
  const router = useRouter()

  const { buscarClientePorCpf } = ClienteService()
  const { buscarFuncionarioPorCpf } = FuncionarioService()

  const [clienteState, setClienteState] = useState<Cliente>(estadoInicialCliente)
  const [funcionarioState, setFuncionarioState] = useState<Funcionario>(estadoInicialFuncionario)

  useEffect(() => {
    const buscar = async () => {
      try {
        const clienteResponse = await buscarClientePorCpf(pedido.cpfCliente)
        setClienteState(clienteResponse.data)

        const funcionarioResponse = await buscarFuncionarioPorCpf(pedido.cpfFuncionario)
        setFuncionarioState(funcionarioResponse.data)
      } catch (error: any) {
        mensagemErro(error.response.data)
      }
    }
    buscar()
  }, [])

  const handleOnClick = () => {
    const urlAtual = window.location.pathname
    router.push(`${urlAtual}/produtos/${pedido.id}`)
  }

  return (
    <div className="cardListagem-container-venda" onClick={handleOnClick}>
      <span id="info-title-venda">Detalhes da Venda</span>
      <div className='container-items'>
        <div className='items'>
          <div className='div-dados'>Nome do Cliente</div>
          <div className='div-resultado'>{clienteState.nome}</div>
          <div className='div-dados'>CPF do Cliente</div>
          <div className='div-resultado'>{pedido.cpfCliente}</div>
          <div className='div-dados'>Nome do Funcionário</div>
          <div className='div-resultado'>{funcionarioState.nome}</div>
          <div className='div-dados'>CPF do Funcionário</div>
          <div className='div-resultado'>{pedido.cpfFuncionario}</div>
        </div>
        <div className='items'>
          <div className='div-dados'>Data e Hora de Cadastro da Venda</div>
          <div className='div-resultado'>{pedido.dataHoraCadastro}</div>
          <div className='div-dados'>Observação</div>
          <div className='div-resultado'>{pedido.observacao}</div>
          <div className='div-dados'>Forma de Pagamento</div>
          <div className='div-resultado'>{pedido.formaDePagamento}</div>
        </div>
      </div>
    </div>
  )
}