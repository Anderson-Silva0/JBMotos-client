"use client";

import { ProductRow } from "@/components/LinhaProduto";
import { Eye } from "@/components/Olho";
import SaleTable from "@/components/TabelaVenda";
import imgProduto from "@/images/checklist.png";
import imgVenda from "@/images/vendas.png";
import { ProductOfSale } from "@/models/ProdutoVenda";
import { formatToBRL } from "@/models/formatadorReal";
import { Product } from "@/models/produto";
import { errorMessage } from "@/models/toast";
import { ProductOfSaleService } from "@/services/ProdutoVendaService";
import { SaleService } from "@/services/VendaService";
import { ProductService } from "@/services/produtoService";
import "@/styles/cardListagem.css";
import Image from "next/image";
import Cookies from "js-cookie";
import { decode } from "jsonwebtoken";
import { DecodedToken } from "@/middleware";
import { ROLE } from "@/models/authRegisterModel";
import { useEffect, useState } from "react";
import { Sale } from "@/models/venda";

interface ProdutosDaVendaProps {
  params: {
    idVenda: number;
  };
}

export default function ProdutosDaVenda({ params }: ProdutosDaVendaProps) {
  const { findProductById: buscarProdutoPorId } = ProductService();

  const { findAllProductOfSaleBySaleId: buscarTodosPorIdVenda } = ProductOfSaleService();

  const { findSaleById: buscarVendaPorId, saleProfit: lucroDaVenda } = SaleService();

  const [produtosDaVendaState, setProdutosDaVendaState] = useState<
    ProductOfSale[]
  >([]);
  const [valorTotalVenda, setValorTotalVenda] = useState<number>(0);
  const [lucroDaVendaState, setLucroDaVendaState] = useState<number>(0);
  const [idNomeProdutoMap, setIdNomeProdutoMap] =
    useState<Map<number, string>>();
  const [userRole, setUserRole] = useState<string>("");

  function loadUserRole() {
    const token = Cookies.get("login-token");
    if (token) {
      const decodedToken = decode(token) as DecodedToken;
      setUserRole(decodedToken.role);
    }
  }

  useEffect(() => {
    const buscarInformacoesDaVenda = async () => {
      try {
        const vendaResponse = await buscarVendaPorId(params.idVenda);
        const venda = vendaResponse.data as Sale;

        if (venda) {
          const produtosVenda = venda.productsOfSale;
          if (produtosVenda) {
            setProdutosDaVendaState(produtosVenda);
          }

          const valorTotalVendaResponse = venda.totalSaleValue;
          if (valorTotalVendaResponse) {
            setValorTotalVenda(valorTotalVendaResponse);
          }

          const lucroDaVendaResponse = await lucroDaVenda(params.idVenda);
          setLucroDaVendaState(lucroDaVendaResponse.data);

          const mapIdNomeProduto = new Map<number, string>();

          produtosVenda.map((produtoVenda) => {
            const produto = produtoVenda.product;
            mapIdNomeProduto.set(produto.id, produto.name);
          });

          setIdNomeProdutoMap(mapIdNomeProduto);
        }
      } catch (erro: any) {
        errorMessage("Erro ao carregar dados.");
      }
    };
    loadUserRole();
    buscarInformacoesDaVenda();
  }, []);

  return (
    <div className="div-container-produtoVenda">
      <h1 className="centered-text">
        {produtosDaVendaState.length > 1 ? (
          <>
            A <Image src={imgVenda} width={60} height={60} alt="" /> Venda
            contém {produtosDaVendaState.length} Produtos {}
            <Image src={imgProduto} width={60} height={60} alt="" />
          </>
        ) : (
          produtosDaVendaState.length === 1 && (
            <>
              A <Image src={imgVenda} width={60} height={60} alt="" /> Venda
              contém {produtosDaVendaState.length} Produto {}
              <Image src={imgProduto} width={60} height={60} alt="" />
            </>
          )
        )}
      </h1>
      <div className="cardListagem-container">
        <span id="info-title-venda">
          {produtosDaVendaState.length === 1 ? (
            <div className="div-dados-title">Detalhes do Produto</div>
          ) : (
            <div className="div-dados-title">Detalhes dos Produtos</div>
          )}
        </span>
        <SaleTable>
          {produtosDaVendaState.map((produtoVenda) => {
            const nomeProduto = idNomeProdutoMap?.get(produtoVenda.product.id);
            if (nomeProduto) {
              return (
                <ProductRow
                  key={produtoVenda.id}
                  name={nomeProduto}
                  productOfSale={produtoVenda}
                />
              );
            }
          })}
        </SaleTable>
      </div>
      <div className="value-box-venda">
        <div className="div-dados-title">Total da Venda</div>
        <div className="div-resultado" style={{ alignItems: "center" }}>
          {formatToBRL(valorTotalVenda)}
        </div>
        {userRole === ROLE.ADMIN && (
          <>
            <div className="div-dados-title">Lucro da Venda</div>
            <Eye isLogin={false} saleProfit={formatToBRL(lucroDaVendaState)} />
          </>
        )}
      </div>
    </div>
  );
}
