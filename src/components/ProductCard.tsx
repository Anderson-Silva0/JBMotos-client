import { Stock, stockInitialState } from "@/models/stock";
import { formatToBRL } from "@/models/currencyFormatters";
import { Supplier, supplierInitialState } from "@/models/supplier";
import { Product } from "@/models/product";
import { errorMessage, successMessage } from "@/models/toast";
import { StockService } from "@/services/stockService";
import { SupplierService } from "@/services/supplierService";
import { ProductService } from "@/services/productService";
import { Check, CheckSquare, Edit, X, XSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "@/styles/listCard.css";
import { ConfirmDecision } from "./ConfirmDecision";
import Cookies from "js-cookie";
import { decode } from "jsonwebtoken";
import { DecodedToken } from "@/middleware";
import { ROLE } from "@/models/authRegisterModel";

interface ProductCardProps {
  product: Product;
  setProduct: Dispatch<SetStateAction<Product[]>>;
}

export default function ProductCard({ product, setProduct }: ProductCardProps) {
  const router = useRouter();

  const { findStockById } = StockService();
  const { findSupplierByCnpj } = SupplierService();
  const { findAllProduct, toggleStatusProduct } = ProductService();

  const [stockState, setStockState] = useState<Stock>(stockInitialState);
  const [supplierState, setSupplierState] = useState<Supplier>(supplierInitialState);
  const [userRole, setUserRole] = useState<string>("");

  function loadUserRole() {
    const token = Cookies.get("login-token");
    if (token) {
      const decodedToken = decode(token) as DecodedToken;
      setUserRole(decodedToken.role);
    }
  }

  useEffect(() => {
    async function search() {
      try {
        const stockResponse = await findStockById(product.stockId);
        setStockState(stockResponse.data);

        const supplierResponse = await findSupplierByCnpj(product.supplierCNPJ);
        setSupplierState(supplierResponse.data);
      } catch (error: any) {
        errorMessage(error.response.data);
      }
    }
    loadUserRole();
    search();
  }, []);

  const handlerToggle = () => {
    if (product.productStatus === "ACTIVE") {
      ConfirmDecision(
        "Desativar Produto",
        "Ao confirmar, o Produto será marcado como inativo e não poderá ser vendido ou utilizado em serviços. Deseja realmente desativar o Produto?",
        () => {
          toggleStatus();
        }
      );
    } else if (product.productStatus === "INACTIVE") {
      ConfirmDecision(
        "Ativar Produto",
        "Ao confirmar, o Produto será marcado como ativo e poderá ser vendido e utilizado em serviços normalmente. Deseja realmente ativar o Produto?",
        () => {
          toggleStatus();
        }
      );
    }
  };

  const toggleStatus = async () => {
    try {
      const statusResponse = await toggleStatusProduct(product.id);
      if (statusResponse.data === "ACTIVE") {
        successMessage("Produto Ativado com sucesso.");
      } else if (statusResponse.data === "INACTIVE") {
        successMessage("Produto Desativado com sucesso.");
      }
    } catch (error) {
      errorMessage("Erro ao tentar definir o Status do Produto.");
    }
    await updateListing();
  };

  const updateListing = async () => {
    try {
      const allProductsResponse = await findAllProduct();
      setProduct(allProductsResponse.data);
    } catch (error) {
      errorMessage("Erro ao tentar buscar todos Produtos.");
    }
  };

  const update = () => {
    router.push(`/produto/atualizar/${product.id}`);
  };

  const productProfit = Number(product.salePrice) - Number(product.costPrice);

  return (
    <div className="cardListagem-container">
      <div className="info-principal">
        <div className="items">
          <span id="info-title">Produto</span>
          <div className="div-dados">Nome</div>
          <div className="div-resultado">{product.name}</div>
          {userRole === ROLE.ADMIN && (
            <>
              <div className="div-dados">Preço de Custo</div>
              <div className="div-resultado">
                {formatToBRL(product.costPrice)}
              </div>
            </>
          )}
          <div className="div-dados">Preço de Venda</div>
          <div className="div-resultado">{formatToBRL(product.salePrice)}</div>
          {userRole === ROLE.ADMIN && (
            <>
              <div className="div-dados">Lucro do Produto</div>
              <div className="div-resultado">{formatToBRL(productProfit)}</div>
            </>
          )}
          <div className="div-dados">Marca</div>
          <div className="div-resultado">{product.brand}</div>
          <div className="div-dados">Fornecedor</div>
          <div className="div-resultado">{supplierState.name}</div>
          <div className="div-dados">Data e Hora de Cadastro</div>
          <div className="div-resultado">{product.createdAt}</div>
        </div>
        <div className="items">
          <span id="info-title">Estoque</span>
          <div className="div-dados">Estoque Mínimo</div>
          <div className="div-resultado">{stockState.minStock}</div>
          <div className="div-dados">Estoque Máximo</div>
          <div className="div-resultado">{stockState.maxStock}</div>
          <div className="div-dados">Quantidade</div>
          <div className="div-resultado">{stockState.quantity}</div>
          <div className="div-dados">Status do Estoque</div>
          <div className="div-resultado">
            {stockState.status === "DISPONIVEL" ? (
              <strong className="item">
                <span style={{ color: "green" }}>Disponível</span>
              </strong>
            ) : stockState.status === "INDISPONIVEL" ? (
              <strong className="item">
                <span style={{ color: "red" }}>Indisponível</span>
              </strong>
            ) : stockState.status === "ESTOQUE_ALTO" ? (
              <strong className="item">
                <span style={{ color: "orange" }}>Estoque Alto</span>
              </strong>
            ) : (
              stockState.status === "ESTOQUE_BAIXO" && (
                <strong className="item">
                  <span style={{ color: "darkred" }}>Estoque Baixo</span>
                </strong>
              )
            )}
          </div>

          <div className="div-dados">Status do Produto</div>
          {product.productStatus === "ACTIVE" ? (
            <div style={{ color: "green" }} className="div-resultado">
              {product.productStatus}
              <Check strokeWidth={3} />
            </div>
          ) : (
            product.productStatus === "INACTIVE" && (
              <div style={{ color: "red" }} className="div-resultado">
                {product.productStatus}
                <X strokeWidth={3} />
              </div>
            )
          )}
        </div>
      </div>
      <div className="icones-container">
        <div onClick={update} title="Editar">
          <Edit className="icones-atualizacao-e-delecao" />
        </div>
        {product.productStatus === "ACTIVE" ? (
          <div onClick={handlerToggle} title="Desativar">
            <XSquare className="icones-atualizacao-e-delecao" />
          </div>
        ) : (
          product.productStatus === "INACTIVE" && (
            <div onClick={handlerToggle} title="Ativar">
              <CheckSquare className="icones-atualizacao-e-delecao" />
            </div>
          )
        )}
      </div>
    </div>
  );
}
