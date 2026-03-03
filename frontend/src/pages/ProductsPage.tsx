import { useState } from "react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../hooks/products";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import type { Product } from "../types/Product";
import type { ProductInput } from "../types/ProductInput";
import { Spinner } from "@/components/ui/spinner";
import { ProductForm } from "@/components/ProductForm";

export function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  function handleSubmit(data: ProductInput) {
    if (editingProduct) {
      updateMutation.mutate(
        {
          id: editingProduct.id,
          data,
        },
        {
          onSuccess: () => {
            handleCancelEdit();
          },
        },
      );
    } else {
      createMutation.mutate(data);
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
  }

  function handleCancelEdit() {
    setEditingProduct(null);
  }

  function handleDelete(id: number, code: string, name: string) {
    if (
      confirm(
        `You are going to delete product ${code} | ${name}. Are you sure?`,
      )
    ) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className='container mx-auto max-w-6xl py-10 space-y-8'>
      <h1 className='text-3xl font-bold tracking-tight'>Products</h1>

      <ProductForm
        initialData={editingProduct ?? undefined}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        onCancel={editingProduct ? handleCancelEdit : undefined}
      />

      {/* LIST */}
      {isLoading ? (
        <div className='flex justify-center py-10'>
          <Spinner className='size-12' />
        </div>
      ) : products && products.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center space-y-4'>
          <p className='text-lg text-muted-foreground'>
            No products available yet.
          </p>
          <Button
            onClick={() => {
              /* perhaps focus form or similar */
            }}
          >
            Create a product
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {products?.map((product) => (
            <Card key={product.id} className='shadow-md'>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>

              <CardContent className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  Code: {product.code}
                </p>

                <p className='text-lg font-semibold'>${product.price}</p>
              </CardContent>

              <CardFooter className='flex justify-between'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </Button>

                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() =>
                    handleDelete(product.id, product.code, product.name)
                  }
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
