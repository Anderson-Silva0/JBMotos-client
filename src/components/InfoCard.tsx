import { formatarParaReal } from '@/models/formatadorReal'
import { PagamentoCartao } from '@/models/pagamentoCartao'
import '@/styles/card.css'
import '@/styles/cardListagem.css'

interface InfoCardProps {
    pagamentoCartao: PagamentoCartao
}

export default function InfoCard({ pagamentoCartao }: InfoCardProps) {
    return (
        <div className='container-info-card'>
            <div className='div-dados'>Parcelas</div>
            <div className='div-resultado'>{pagamentoCartao.parcela}</div>

            <div className='div-dados'>Bandeira</div>
            <div className='div-resultado'>{pagamentoCartao.bandeira}</div>

            <div className='div-dados'>Total de Taxas</div>
            <div className='div-resultado'>{formatarParaReal(pagamentoCartao.totalTaxas)}</div>
        </div>
    )
}