import { RegistroProdutoSelecionadoProps } from '@/app/venda/cadastro/page'
import { Produto } from '@/models/produto'
import '@/styles/home.css'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ConfirmarDecisao } from './ConfirmarDecisao'

interface GeradorPDFProps {
    tipoRecibo: TipoRecibo
    nomeCliente: string
    cpfCliente: string | number
    nomeFuncionario: string | number
    formaPagamento: string | number
    observacao: string
    valorTotalVenda: string
    produtosVenda: RegistroProdutoSelecionadoProps[]
    dataHoraVenda?: string
}

enum TipoUso {
    Titulo,
    Texto
}

export enum TipoRecibo {
    Orcamento,
    comprovante
}

export const removerProdutoOrcamento = (registrosProdutosVenda: RegistroProdutoSelecionadoProps[], produtoExcluido: Produto) => {
    const idProdutoExcluido = produtoExcluido.id
    const indiceProduto = registrosProdutosVenda.findIndex(produto => produto.idProduto === idProdutoExcluido)
    registrosProdutosVenda.splice(indiceProduto, 1)
}

export function GeradorPDF(props: GeradorPDFProps) {

    const gerarPDF = () => {
        const doc = new jsPDF()

        const obterDataHoraAgora = (tipoUso: TipoUso) => {
            const hoje = new Date()

            const dia = String(hoje.getDate()).padStart(2, '0')
            const mes = String(hoje.getMonth() + 1).padStart(2, '0')
            const ano = hoje.getFullYear()

            const horas = String(hoje.getHours()).padStart(2, '0')
            const minutos = String(hoje.getMinutes()).padStart(2, '0')
            const segundos = String(hoje.getSeconds()).padStart(2, '0')

            if (tipoUso === TipoUso.Titulo) {
                return `${dia}-${mes}-${ano}_${horas}-${minutos}-${segundos}`
            } else if (tipoUso === TipoUso.Texto) {
                return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`
            }
        }

        props.tipoRecibo === TipoRecibo.Orcamento ? (
            autoTable(doc, {
                startY: 10,
                tableWidth: 110,

                head: [['Orçamento da JB Motos']],
                theme: 'striped',
                styles: { halign: 'center' },
                margin: { horizontal: 50 },
                headStyles: {
                    halign: 'center',
                    fontSize: 20,
                }
            })
        ) : props.tipoRecibo === TipoRecibo.comprovante && (
            autoTable(doc, {
                startY: 10,
                tableWidth: 110,

                head: [['Comprovante de Venda da JB Motos']],
                theme: 'striped',
                styles: { halign: 'center' },
                margin: { horizontal: 50 },
                headStyles: {
                    halign: 'center',
                    fontSize: 17,
                }
            })
        )

        const alturaTabelaInfo = 38

        autoTable(doc, {
            startY: alturaTabelaInfo,
            head: [['Cliente', 'CPF do Cliente', 'Funcionário', 'Forma de Pagamento', 'Observação']],
            body: [[props.nomeCliente, props.cpfCliente, props.nomeFuncionario, props.formaPagamento, props.observacao]],
            theme: 'striped',
            styles: { halign: 'center' },
            columnStyles: {
                4: { cellWidth: 35 }
            }
        })

        const produtos = props.produtosVenda.map(produto => [
            produto.nomeProduto, produto.quantidade,
            produto.valorUnidade,
            produto.valorTotal
        ])

        const alturaTabelaOrcamento = props.observacao.length * 0.14 + 75

        autoTable(doc, {
            startY: alturaTabelaOrcamento,
            head: [['Produto', 'Quantidade', 'Valor Unidade', 'Valor Total']],
            body: produtos,
            theme: 'grid',
            styles: { halign: 'center' }
        })

        const alturaTabelaValorTotal = alturaTabelaOrcamento + produtos.length * 7 + 30

        autoTable(doc, {
            startY: alturaTabelaValorTotal,
            tableWidth: 60,
            head: [['Valor Total']],
            body: [[props.valorTotalVenda]],
            theme: 'striped',
            styles: { halign: 'center' },
            margin: { horizontal: 75 }
        })

        props.tipoRecibo === TipoRecibo.Orcamento ? (
            doc.text(String(obterDataHoraAgora(TipoUso.Texto)), 79, 292)
        ) : props.tipoRecibo === TipoRecibo.comprovante && (
            props.dataHoraVenda && (
                autoTable(doc, {
                    startY: 264,
                    tableWidth: 60,

                    head: [['Data e Hora da Venda']],
                    body: [[props.dataHoraVenda]],
                    theme: 'grid',
                    styles: { halign: 'center', fontSize: 12, fontStyle: 'bold' },
                    margin: { horizontal: 75 },
                    headStyles: {
                        halign: 'center',
                        fontSize: 14,
                    }
                })
            )
        )

        props.tipoRecibo === TipoRecibo.Orcamento ? (
            doc.save(`orcamento_JBMotos_${obterDataHoraAgora(TipoUso.Titulo)}.pdf`)
        ) : props.tipoRecibo === TipoRecibo.comprovante && (
            doc.save(`comprovante_venda_JBMotos_${obterDataHoraAgora(TipoUso.Titulo)}.pdf`)
        )
    }

    const handlerDecisao = () => {
        props.tipoRecibo === TipoRecibo.Orcamento ? (
            ConfirmarDecisao("Orçamento em PDF", "Tem certeza que deseja criar o orçamento em formato PDF?", gerarPDF)
        ) : props.tipoRecibo === TipoRecibo.comprovante && (
            ConfirmarDecisao("Comprovante de Venda em PDF", "Tem certeza que deseja criar o comprovante de venda em formato PDF?", gerarPDF)
        )
    }

    return (
        props.tipoRecibo === TipoRecibo.Orcamento ? (
            <button className='botao-gerar-pdf' onClick={handlerDecisao}>
                Gerar PDF Orçamento
            </button >
        ) : props.tipoRecibo === TipoRecibo.comprovante && (
            <button className='botao-gerar-pdf' onClick={handlerDecisao}>
                PDF Comprovante
            </button >
        )
    )
}
