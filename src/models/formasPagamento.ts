import { OpcoesSelecoes } from "./Selecoes"

export const formasPagamentos = [
    { value: 'PIX', label: 'PIX' },
    { value: 'Transferência Bancária', label: 'Transferência Bancária' },
    { value: 'Dinheiro', label: 'Dinheiro' },
    { value: 'Cartão de débito', label: 'Cartão de Débito' },
    { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
    { value: 'Boleto Bancário', label: 'Boleto Bancário' }
]

export const bandeiras: OpcoesSelecoes[] = [
    { label: "Mastercard", value: "Mastercard" },
    { label: "Hipercard", value: "Hipercard" },
    { label: "Visa", value: "Visa" },
    { label: "Elo", value: "Elo" },
    { label: "American Express", value: "American Express" },
    { label: "Sorocred", value: "Sorocred" },
    { label: "Aura", value: "Aura" },
    { label: "Diners Club International", value: "Diners Club International" }
]

export const obterParcelas = () => {
    const parcelas: OpcoesSelecoes[] = []

    for (let i = 1; i <= 24; i++) {
        const label = `${i}x`
        const value = label
        parcelas.push({ label, value })
    }

    return parcelas
}