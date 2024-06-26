import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AddStock from "./mini-componentes/editTables/addStockProduct";
import AddProductModal from "./mini-componentes/addProductModal";
import AddTypeModal from "./mini-componentes/addTypeModal";
import EditProductModal from "./mini-componentes/editTables/editProductModal";
import CreateSaleModal from "./mini-componentes/addSaleProduct";

import {
  PlusIcon,
  CurrencyDollarIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  ClipboardIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddTypeModalOpen, setAddTypeModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isAddStockModalOpen, setAddStockModalOpen] = useState(false);
const [selectedProductId, setSelectedProductId] = useState()

const [selectedProductForSale, setSelectedProductForSale] = useState(null);
const [isCreateSaleModalOpen, setCreateSaleModalOpen] = useState(false);



const openCreateIndividualSell = (product) => {
  setSelectedProductForSale(product);
  setCreateSaleModalOpen(true);
};



  const closeAddStockModal = () => {
    setAddStockModalOpen(false);
  };

  
  const openAddTypeModal = () => {
    setAddTypeModalOpen(true);
  };

  const closeAddTypeModal = () => {
    setAddTypeModalOpen(false);
  };

  const openAddProductModal = () => {
    setAddProductModalOpen(true);
  };

  const closeAddProductModal = () => {
    setAddProductModalOpen(false);
  };

  const openEditProductModal = (product) => {
    setSelectedProduct(product);
    setEditProductModalOpen(true);
  };

  const openAddStockModal = (product) => {
    setAddStockModalOpen(true);
    setSelectedProduct(product); // Fijar el ID del producto seleccionado
  };

  const closeEditProductModal = () => {
    setEditProductModalOpen(false);
  };



  /*
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      Swal.fire({
        title: 'Exito!',
        text: 'ID del producto copiado.',
        icon: 'success',
      });
    } catch (err) {
      Swal.fire({
        title: 'Fallo',
        text: 'No se ha podido copiar el ID del producto.',
        icon: 'error',
      });
    }
  };

*/
  const getStocksForProduct = async (productId) => {
    try {
      const response = await fetch(`http://vps-3732767-x.dattaweb.com:82/api/stocks/${productId}`);
      if (response.ok) {
        const data = await response.json();
        const stockTotal = data.reduce((total, stock) => total + stock.stockTotal, 0);
        return stockTotal;
      } else {
        console.error("Error al recuperar los stocks para el producto");
        return 0;
      }
    } catch (error) {
      console.error("Error al recuperar los stocks para el producto:", error);
      return 0;
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch("http://vps-3732767-x.dattaweb.com:82/api/productos");
      if (response.ok) {
        
        const data = await response.json();
        const productsWithTotalStock = await Promise.all(data.map(async (product) => {
          const totalStock = await getStocksForProduct(product._id);
          return { ...product, stockTotal: totalStock }; // Agrega el stock total al producto
        }));
        setProducts(productsWithTotalStock);
        setFilteredProducts(productsWithTotalStock);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'El servidor de datos ha fallado.',
          icon: 'error',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'El servidor de datos ha fallado.',
        icon: 'error',
      });
    }
  };



  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://vps-3732767-x.dattaweb.com:82/api/productos/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        
        loadProducts();
      } else {
        console.error("Error al eliminar el producto desde la API");
      }
    } catch (error) {
      console.error("Error al eliminar el producto desde la API:", error);
    }
  };


  useEffect(() => {
    loadProducts();
  }, []);



  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    const searchResults = products.filter((product) => {
      return (
        product._id.includes(searchTerm) ||
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredProducts(searchResults);
  };

  return (
    <div className="p-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex w-12/12">
          <input
            type="text"
            placeholder="Buscar productos"
            className="p-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex">
          <div className="m-2">
            <button
              onClick={openAddProductModal}
              className="bg-green-500 text-white p-2 rounded"
            >
              <PlusIcon className="h-4 w-4 " />
            </button>
            <AddProductModal
              isOpen={isAddProductModalOpen}
              closeModal={closeAddProductModal}
            />
          </div>
          <div className="m-2">
            <button
              onClick={openAddTypeModal}
              className="bg-black text-white p-2 rounded"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
            <AddTypeModal
              isOpen={isAddTypeModalOpen}
              closeModal={closeAddTypeModal}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-1">Nombre</th>
              <th className="p-1">Tipo</th>
              <th className="p-1">Venta</th>
              <th className="p-1">Compra</th>
              <th className="p-1">Stock</th>
              <th className="p-1">Imagen</th>
              <th className="p-1">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="p-1 border text-center font-serif border-gray-300">
                  {product.nombre}
                </td>
                <td className="p-1 border text-center font-serif border-gray-300">
                  {product.tipo}
                </td>
                <td className="p-1 border text-center font-serif border-gray-300">
                  {`$${product.precioVenta}`}
                </td>
                <td className="p-1 border text-center font-serif border-gray-300">
                  {`$${product.precioCompra}`}
                </td>
                <td className="p-1 border text-center font-serif border-gray-300">
                  {product.stockTotal}
                </td>
                <td className="p-1 border border-gray-300 text-center">
                  <img
                    src={product.imagenURL}
                    alt={product.nombre}
                    className="w-16 h-16 mx-auto my-auto"
                  />
                </td>
                <td className="p-2 border border-gray-300 text-center">
                  <button
                    className="bg-yellow-500 text-white p-2 rounded-lg m-1"
                    onClick={() => openEditProductModal(product)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg m-1"
                    onClick={() => deleteProduct(product._id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="bg-amber-800 text-white p-2 rounded-lg m-1"
                    onClick={() => openAddStockModal(product)}
                  >
                    <ClipboardIcon className="h-4 w-4"></ClipboardIcon>
                  </button>

              
                  <button
                    className="bg-yellow-500 text-white p-2 rounded"
                    onClick={() => openCreateIndividualSell(product)}
                  >
                    <CurrencyDollarIcon className="h-4 w-4" />
                  </button>



                 {/*  BOTON DE COPIAR ID 

                 <button className="bg-amber-800 text-white p-2 rounded-lg m-1">
                    <ShareIcon
                      className="h-4 w-4"
                      onClick={() => copyToClipboard(product._id)}
                    />
                  </button>

                  */}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*
 ----------------- MODALS ------------------------
*/}

<CreateSaleModal
        isOpen={isCreateSaleModalOpen}
        closeModal={() => setCreateSaleModalOpen(false)}
        product={selectedProductForSale}
      />

    <AddStock
        isOpen={isAddStockModalOpen}
        closeModal={closeAddStockModal}
        product={selectedProduct} // Asegúrate de tener el ID del producto seleccionado
      />

      <EditProductModal
        isOpen={isEditProductModalOpen}
        closeModal={closeEditProductModal}
        product={selectedProduct}
        onEditProduct={(editedProduct) => {
          console.log("Producto editado:", editedProduct);
          loadProducts();
        }}
      />
    </div>
  );
};

export default ProductTable;
