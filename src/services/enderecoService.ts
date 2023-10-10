import { Endereco } from "@/models/endereco"
import { Erros } from "@/models/erros"
import { mensagemErro } from "@/models/toast"
import axios from "axios"
import { Dispatch, SetStateAction } from "react"
import { ApiService } from "./apiService"

export const EnderecoService = () => {

    const url = "/endereco"

    const salvarEndereco = (dados: object) => {
        return ApiService.post(`${url}`, dados)
    }

    const buscarTodosEnderecos = () => {
        return ApiService.get(`${url}/buscar-todos`)
    }

    const buscarEnderecoPorId = (id: number) => {
        return ApiService.get(`${url}/buscar/${id}`)
    }

    const atualizarEndereco = (id: number, dados: object) => {
        return ApiService.put(`${url}/atualizar/${id}`, dados)
    }

    const deletarEndereco = (id: number) => {
        return ApiService.delete(`${url}/deletar/${id}`)
    }

    const buscarEnderecoPorCep = (cep: string) => {
        return axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    }

    const obterEnderecoPorCep = async (
        endereco: Endereco,
        setEndereco: Dispatch<SetStateAction<Endereco>>,
        erros: Erros[],
        setErros: Dispatch<SetStateAction<Erros[]>>
    ) => {
        if (endereco.cep.length < 9 && endereco.rua || endereco.cidade || endereco.bairro) {
            setEndereco({ ...endereco, rua: '', bairro: '', cidade: '' })
        }
        const buscarEndereco = async () => {
            try {
                const enderecoResponse = await buscarEnderecoPorCep(endereco.cep)
                if (enderecoResponse.data.erro) {
                    setErros([...erros, {
                        nomeInput: 'cep',
                        mensagemErro: 'CEP inexistente. Verifique e corrija.',
                    }])
                } else if (enderecoResponse.data.uf === 'PE') {
                    setEndereco({
                        ...endereco,
                        rua: enderecoResponse.data.logradouro,
                        bairro: enderecoResponse.data.bairro,
                        cidade: enderecoResponse.data.localidade
                    })
                } else {
                    setErros([...erros, {
                        nomeInput: 'cep',
                        mensagemErro: 'Verifique o CEP, não é de Pernambuco.',
                    }])
                }
            } catch (error: any) {
                mensagemErro('Erro ao tentar buscar Endereço por CEP.')
            }
        }
        if (endereco.cep.length === 9) {
            buscarEndereco()
        }
    }

    return {
        salvarEndereco,
        buscarTodosEnderecos,
        buscarEnderecoPorId,
        atualizarEndereco,
        deletarEndereco,
        obterEnderecoPorCep
    }
}
