import { SelectedProductRegisterProps as SelectedProductRegisterProps } from "@/app/(pages)/venda/cadastro/page";
import { Product } from "@/models/product";
import "@/styles/home.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ConfirmDecision } from "./ConfirmDecision";

interface PDFGeneratorProps {
  receiptType: ReceiptType;
  customerName: string;
  customerCpf: string | number;
  employeeName: string | number;
  paymentMethod: string | number;
  observation: string;
  totalSaleValue: string;
  productOfSaleRegister: SelectedProductRegisterProps[];
  saleDateTime?: string;
}

enum UsageType {
  Title,
  Text,
}

export enum ReceiptType {
  Budget,
  Receipt,
}

export const removeProductFromBudget = (
  saleProductsRegisters: SelectedProductRegisterProps[],
  deletedProduct: Product
) => {
  const deletedProductId = deletedProduct.id;
  const productIndex = saleProductsRegisters.findIndex(
    (product) => product.productId === deletedProductId
  );
  saleProductsRegisters.splice(productIndex, 1);
};

export function PDFGenerator(props: PDFGeneratorProps) {
  const generatePDF = () => {
    const doc = new jsPDF();

    const getCurrentDateTime = (usageType: UsageType) => {
      const today = new Date();

      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();

      const hours = String(today.getHours()).padStart(2, "0");
      const minutes = String(today.getMinutes()).padStart(2, "0");
      const seconds = String(today.getSeconds()).padStart(2, "0");

      if (usageType === UsageType.Title) {
        return `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
      } else if (usageType === UsageType.Text) {
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      }
    };

    props.receiptType === ReceiptType.Budget
      ? autoTable(doc, {
          startY: 10,
          tableWidth: 110,

          head: [["Orçamento da JB Motos"]],
          theme: "striped",
          styles: { halign: "center" },
          margin: { horizontal: 50 },
          headStyles: {
            halign: "center",
            fontSize: 20,
          },
        })
      : props.receiptType === ReceiptType.Receipt &&
        autoTable(doc, {
          startY: 10,
          tableWidth: 110,

          head: [["Comprovante de Venda da JB Motos"]],
          theme: "striped",
          styles: { halign: "center" },
          margin: { horizontal: 50 },
          headStyles: {
            halign: "center",
            fontSize: 17,
          },
        });

    const tableInfoHeight = 38;

    autoTable(doc, {
      startY: tableInfoHeight,
      head: [
        [
          "Cliente",
          "CPF do Cliente",
          "Funcionário",
          "Forma de Pagamento",
          "Observação",
        ],
      ],
      body: [
        [
          props.customerName,
          props.customerCpf,
          props.employeeName,
          props.paymentMethod,
          props.observation,
        ],
      ],
      theme: "striped",
      styles: { halign: "center" },
      columnStyles: {
        4: { cellWidth: 35 },
      },
    });

    const products = props.productOfSaleRegister.map((product) => [
      product.productName,
      product.quantity,
      product.unitValue,
      product.totalValue,
    ]);

    const budgetTableHeight = props.observation.length * 0.14 + 75;

    autoTable(doc, {
      startY: budgetTableHeight,
      head: [["Produto", "Quantidade", "Valor Unidade", "Valor Total"]],
      body: products,
      theme: "grid",
      styles: { halign: "center" },
    });

    const totalValueTableHeight =
      budgetTableHeight + products.length * 7 + 30;

    autoTable(doc, {
      startY: totalValueTableHeight,
      tableWidth: 60,
      head: [["Valor Total"]],
      body: [[props.totalSaleValue]],
      theme: "striped",
      styles: { halign: "center" },
      margin: { horizontal: 75 },
    });

    props.receiptType === ReceiptType.Budget
      ? doc.text(String(getCurrentDateTime(UsageType.Text)), 79, 292)
      : props.receiptType === ReceiptType.Receipt &&
        props.saleDateTime &&
        autoTable(doc, {
          startY: 264,
          tableWidth: 60,

          head: [["Data e Hora da Venda"]],
          body: [[props.saleDateTime]],
          theme: "grid",
          styles: { halign: "center", fontSize: 12, fontStyle: "bold" },
          margin: { horizontal: 75 },
          headStyles: {
            halign: "center",
            fontSize: 14,
          },
        });

    props.receiptType === ReceiptType.Budget
      ? doc.save(`orcamento_JBMotos_${getCurrentDateTime(UsageType.Title)}.pdf`)
      : props.receiptType === ReceiptType.Receipt &&
        doc.save(
          `comprovante_venda_JBMotos_${getCurrentDateTime(UsageType.Title)}.pdf`
        );
  };

  const handlerDecisao = () => {
    props.receiptType === ReceiptType.Budget
      ? ConfirmDecision(
          "Orçamento em PDF",
          "Tem certeza que deseja criar o orçamento em formato PDF?",
          generatePDF
        )
      : props.receiptType === ReceiptType.Receipt &&
        ConfirmDecision(
          "Comprovante de Venda em PDF",
          "Tem certeza que deseja criar o comprovante de venda em formato PDF?",
          generatePDF
        );
  };

  return (
    <button className="botao-gerar-pdf" onClick={handlerDecisao}>
      {props.receiptType === ReceiptType.Budget
        ? "PDF Orçamento"
        : props.receiptType === ReceiptType.Receipt && "PDF Comprovante"}
    </button>
  );
}
