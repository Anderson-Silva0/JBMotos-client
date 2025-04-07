"use client";

import LoadingLogo from "@/components/LoadingLogo";
import ProductCard from "@/components/ProductCard";
import imgProduto from "@/images/checklist.png";
import { parseDate } from "@/models/stringToDate";
import { Product } from "@/models/product";
import { errorMessage } from "@/models/toast";
import { ProductService } from "@/services/productService";
import { Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import "@/styles/card.css";

export default function ListProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [searchInputValue, setSearchInputValue] = useState<string>("");

  const [selectedField, setSelectedField] = useState<string>("");

  const { filterProduct } = ProductService();

  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const checkboxSelectionToggle = (value: string) => {
    setSelectedValue(value === selectedValue ? null : value);
  };

  useEffect(() => {
    if (selectedValue === "antigo") {
      const sortedRecentProducts = [...products].sort(
        (a: Product, b: Product) =>
          parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime()
      );
      setProducts(sortedRecentProducts);
    } else if (selectedValue === "recente") {
      const sortedRecentProducts = [...products].sort(
        (a: Product, b: Product) =>
          parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime()
      );
      setProducts(sortedRecentProducts);
    }
  }, [selectedValue]);

  useEffect(() => {
    const findById = async () => {
      try {
        const productResponse = await filterProduct(
          selectedField,
          searchInputValue
        );
        setProducts(productResponse.data);
      } catch (error: any) {
        errorMessage("Erro ao tentar buscar Produto.");
      } finally {
        setIsLoaded(true);
      }
    };
    findById();
  }, [searchInputValue, selectedField]);

  useEffect(() => {
    setSearchInputValue("");
  }, [selectedField]);

  const handleRadioClick = (campo: string) => {
    if (selectedField === campo) {
      setSelectedField("");
    }
  };

  if (!isLoaded) {
    return <LoadingLogo description="Carregando" />;
  }

  return (
    <div className="div-form-container">
      <h1 className="centered-text">
        {selectedField === "" ? (
          products.length > 1 ? (
            <>
              <Image src={imgProduto} width={60} height={60} alt="" />{" "}
              {products.length} Produtos cadastrados
            </>
          ) : products.length === 1 ? (
            <>
              <Image src={imgProduto} width={60} height={60} alt="" />{" "}
              {products.length} Produto cadastrado
            </>
          ) : (
            "Nenhum Produto cadastrado no sistema"
          )
        ) : (
          selectedField !== "" &&
          searchInputValue !== "" && (
            <>
              {products.length === 1 ? (
                <strong>{products.length} Produto encontrado</strong>
              ) : products.length > 1 ? (
                <strong>{products.length} Produtos encontrados</strong>
              ) : (
                "Nenhum Produto encontrado"
              )}
            </>
          )
        )}
      </h1>
      {products.length > 0 && (
        <>
          <div className="div-container-buscar">
            <div className="div-buscar">
              <Search size={60} strokeWidth={3} />
              {selectedField === "" ? (
                <div className="div-msg-busca">
                  <p>Selecione o filtro desejado:</p>
                </div>
              ) : selectedField === "nome" ? (
                <input
                  className="input-buscar"
                  placeholder="Digite o Nome"
                  type="search"
                  onChange={(e) => setSearchInputValue(e.target.value)}
                />
              ) : selectedField === "marca" ? (
                <input
                  className="input-buscar"
                  placeholder="Digite a marca"
                  type="search"
                  onChange={(e) => setSearchInputValue(e.target.value)}
                />
              ) : (
                selectedField === "statusProduto" && (
                  <>
                    <div style={{ marginRight: "2vw" }}>
                      <label className="label-radio" htmlFor="opcaoStatusProduto1">
                        ATIVO
                      </label>
                      <input
                        id="opcaoStatusProduto1"
                        className="input-radio"
                        type="radio"
                        name="status"
                        value={selectedField}
                        onChange={() => setSearchInputValue("ATIVO")}
                      />
                    </div>
                    <div>
                      <label className="label-radio" htmlFor="opcaoStatusProduto2">
                        INATIVO
                      </label>
                      <input
                        id="opcaoStatusProduto2"
                        className="input-radio"
                        type="radio"
                        name="status"
                        value={selectedField}
                        onChange={() => setSearchInputValue("INATIVO")}
                      />
                    </div>
                  </>
                )
              )}
            </div>
            <div className="div-radios">
              <div className="div-dupla-radio">
                <label className="label-radio" htmlFor="opcaoNome">
                  Nome
                </label>
                <input
                  className="input-radio"
                  type="radio"
                  name="opcao"
                  id="opcaoNome"
                  value={selectedField}
                  onChange={() => setSelectedField("nome")}
                  onClick={() => handleRadioClick("nome")}
                  checked={selectedField === "nome"}
                />
              </div>
              <div className="div-dupla-radio">
                <label className="label-radio" htmlFor="opcaoMarca">
                  Marca
                </label>
                <input
                  className="input-radio"
                  type="radio"
                  name="opcao"
                  id="opcaoMarca"
                  value={selectedField}
                  onChange={() => setSelectedField("marca")}
                  onClick={() => handleRadioClick("marca")}
                  checked={selectedField === "marca"}
                />
              </div>
              <div className="div-dupla-radio">
                <label className="label-radio" htmlFor="opcaoStatusProduto">
                  Status do Produto
                </label>
                <input
                  className="input-radio"
                  type="radio"
                  name="opcao"
                  id="opcaoStatusProduto"
                  value={selectedField}
                  onChange={() => setSelectedField("statusProduto")}
                  onClick={() => handleRadioClick("statusProduto")}
                  checked={selectedField === "statusProduto"}
                />
              </div>
            </div>
          </div>
          <div className="div-dupla-check">
            <div
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                fontWeight: "bolder",
              }}
            >
              <label className="label-radio" htmlFor="recente">
                Mais recente
              </label>
              <input
                className="input-check"
                type="checkbox"
                name="filtroData"
                id="recente"
                value="recente"
                checked={selectedValue === "recente"}
                onChange={() => checkboxSelectionToggle("recente")}
              />
            </div>
            <div style={{ display: "flex", whiteSpace: "nowrap" }}>
              <label className="label-radio" htmlFor="antigo">
                Mais antigo
              </label>
              <input
                className="input-check"
                type="checkbox"
                name="filtroData"
                id="antigo"
                value="antigo"
                checked={selectedValue === "antigo"}
                onChange={() => checkboxSelectionToggle("antigo")}
              />
            </div>
          </div>

          {products.map((produto) => {
            return (
              <ProductCard
                key={produto.id}
                product={produto}
                setProduct={setProducts}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
