import { RegistroProdutoSelecionadoProps } from '@/app/venda/cadastro/page'
import { Produto } from '@/models/produto'
import { confirmarDecisao } from '@/models/toast'
import '@/styles/home.css'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface GeradorPDFProps {
    nomeCliente: string
    cpfCliente: string | number
    nomeFuncionario: string | number
    formaPagamento: string | number
    observacao: string
    valorTotalVenda: string
    produtosVenda: RegistroProdutoSelecionadoProps[]
}

enum TipoUso {
    Titulo,
    Texto
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

        doc.text(String(obterDataHoraAgora(TipoUso.Texto)), 79, 292)

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

        const alturaTabelaInfo = 43

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

        const alturaTabelaOrcamento = props.observacao.length * 0.16 + 85

        autoTable(doc, {
            startY: alturaTabelaOrcamento,
            head: [['Produto', 'Quantidade', 'Valor Unidade', 'Valor Total']],
            body: produtos,
            theme: 'grid',
            styles: { halign: 'center' }
        })

        const alturaTabelaValorTotal = alturaTabelaOrcamento + produtos.length * 8 + 30

        autoTable(doc, {
            startY: alturaTabelaValorTotal,
            tableWidth: 60,
            head: [['Valor Total']],
            body: [[props.valorTotalVenda]],
            theme: 'striped',
            styles: { halign: 'center' },
            margin: { horizontal: 75 }
        })

        doc.save(`orcamento_oficina_${obterDataHoraAgora(TipoUso.Titulo)}.pdf`)
    }

    const handlerDecisao = () => {
        confirmarDecisao("Orçamento em PDF", "Tem certeza que deseja criar o orçamento em formato PDF?", gerarPDF)
    }

    return (
        <button className='botao-gerar-pdf' onClick={handlerDecisao}>
            Gerar PDF Orçamento
        </button >
    )
}
