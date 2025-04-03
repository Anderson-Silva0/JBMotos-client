"use client";

import { ProductRow } from "@/components/ProductRow";
import { Eye } from "@/components/Eye";
import SaleTable from "@/components/SaleTable";
import imgProduto from "@/images/checklist.png";
import imgVenda from "@/images/vendas.png";
import { ProductOfSale } from "@/models/productOfSale";
import { formatToBRL } from "@/models/currencyFormatters";
import { errorMessage } from "@/models/toast";
import { SaleService } from "@/services/saleService";
import "@/styles/listCard.css";
import Image from "next/image";
import Cookies from "js-cookie";
import { decode } from "jsonwebtoken";
import { DecodedToken } from "@/middleware";
import { ROLE } from "@/models/authRegisterModel";
import { useEffect, useState } from "react";
import { Sale } from "@/models/sale";

interface ProductsOfSaleProps {
  params: {
    saleId: number;
  };
}

export default function ProductsOfSale({ params }: ProductsOfSaleProps) {
  const { findSaleById, saleProfit } = SaleService();

  const [productsOfSaleState, setProductsOfSaleState] = useState<ProductOfSale[]>([]);
  const [totalSaleValue, setTotalSaleValue] = useState<number>(0);
  const [saleProfitState, setSaleProfitState] = useState<number>(0);
  const [idNameProductMap, setIdNameProductMap] = useState<Map<number, string>>();
  const [userRole, setUserRole] = useState<string>("");

  function loadUserRole() {
    const token = Cookies.get("login-token");
    if (token) {
      const decodedToken = decode(token) as DecodedToken;
      setUserRole(decodedToken.role);
    }
  }

  useEffect(() => {
    const fetchSaleInformation = async () => {
      try {
        const saleResponse = await findSaleById(params.saleId);
        const sale = saleResponse.data as Sale;

        if (sale) {
          const productsOfSale = sale.productsOfSale;
          if (productsOfSale) {
            setProductsOfSaleState(productsOfSale);
          }

          const totalSaleValueResponse = sale.totalSaleValue;
          if (totalSaleValueResponse) {
            setTotalSaleValue(totalSaleValueResponse);
          }

          const saleProfitResponse = await saleProfit(params.saleId);
          setSaleProfitState(saleProfitResponse.data);

          const idNameProductMap = new Map<number, string>();

          productsOfSale.map((productOfSale) => {
            const product = productOfSale.product;
            idNameProductMap.set(product.id, product.name);
          });

          setIdNameProductMap(idNameProductMap);
        }
      } catch (erro: any) {
        errorMessage("Erro ao carregar dados.");
      }
    };
    loadUserRole();
    fetchSaleInformation();
  }, []);

  return (
    <div className="div-container-produtoVenda">
      <h1 className="centered-text">
        {productsOfSaleState.length > 1 ? (
          <>
            A <Image src={imgVenda} width={60} height={60} alt="" /> Venda
            contém {productsOfSaleState.length} Produtos {}
            <Image src={imgProduto} width={60} height={60} alt="" />
          </>
        ) : (
          productsOfSaleState.length === 1 && (
            <>
              A <Image src={imgVenda} width={60} height={60} alt="" /> Venda
              contém {productsOfSaleState.length} Produto {}
              <Image src={imgProduto} width={60} height={60} alt="" />
            </>
          )
        )}
      </h1>
      <div className="cardListagem-container">
        <span id="info-title-venda">
          {productsOfSaleState.length === 1 ? (
            <div className="div-dados-title">Detalhes do Produto</div>
          ) : (
            <div className="div-dados-title">Detalhes dos Produtos</div>
          )}
        </span>
        <SaleTable>
          {productsOfSaleState.map((produtoVenda) => {
            const nomeProduto = idNameProductMap?.get(produtoVenda.product.id);
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
          {formatToBRL(totalSaleValue)}
        </div>
        {userRole === ROLE.ADMIN && (
          <>
            <div className="div-dados-title">Lucro da Venda</div>
            <Eye isLogin={false} saleProfit={formatToBRL(saleProfitState)} />
          </>
        )}
      </div>
    </div>
  );
}
