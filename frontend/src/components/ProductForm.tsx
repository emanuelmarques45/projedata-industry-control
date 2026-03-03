import React, { useEffect, useState } from "react";
import { useRawMaterials } from "@/hooks/rawMaterial";
import type { ProductInput } from "@/types/ProductInput";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { useProducts } from "@/hooks/products";
import type { Product } from "@/types/Product";

interface Props {
  initialData?: Product;
  onSubmit: (data: ProductInput) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ProductForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}: Props) {
  const { data: rawMaterials = [] } = useRawMaterials();
  const { data: products = [] } = useProducts();

  const emptyForm: ProductInput = {
    code: "",
    name: "",
    price: 0,
    RawMaterials: [],
  };

  const [formData, setFormData] = useState<ProductInput>(
    initialData ?? emptyForm,
  );

  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [quantityRequired, setQuantityRequired] = useState<number>(0);
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(initialData ?? emptyForm);
    setCodeError(null);
  }, [initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));

    if (name === "code") {
      const exists = products.some(
        (p) => p.code === value && p.id !== initialData?.id,
      );
      setCodeError(exists ? "A product with this code already exists." : null);
    }
  }

  function handleAddMaterial() {
    if (!selectedMaterial || quantityRequired <= 0) return;

    const id = Number(selectedMaterial);
    if (formData.RawMaterials.some((m) => m.id === id)) return;

    const found = rawMaterials.find((rm) => rm.id === id);
    if (!found) return;

    setFormData((prev) => ({
      ...prev,
      RawMaterials: [
        ...prev.RawMaterials,
        {
          id,
          code: found.code,
          name: found.name,
          stock_quantity: found.stock_quantity,
          ProductRawMaterial: {
            raw_material_id: id,
            product_id: 0,
            required_quantity: quantityRequired,
          },
        },
      ],
    }));

    setSelectedMaterial("");
    setQuantityRequired(0);
  }

  function handleRemoveMaterial(id: number) {
    setFormData((prev) => ({
      ...prev,
      RawMaterials: prev.RawMaterials.filter((m) => m.id !== id),
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (codeError) return;

    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='code'>Code</Label>
        <Input
          id='code'
          name='code'
          value={formData.code}
          onChange={handleChange}
          required
          placeholder='PR-000'
        />
        {codeError && <p className='text-red-500 text-sm mt-1'>{codeError}</p>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          required
          placeholder='Notebook'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='price'>Price</Label>
        <Input
          id='price'
          type='number'
          name='price'
          value={formData.price}
          onChange={handleChange}
          required
          min='0'
          step='0.01'
        />
      </div>

      {/* Materials Association */}
      <div className='space-y-3 border rounded-lg p-4'>
        <h3 className='font-semibold'>Raw Materials</h3>

        <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
          <SelectTrigger>
            <SelectValue placeholder='Select material' />
          </SelectTrigger>
          <SelectContent>
            {rawMaterials.map((rm) => (
              <SelectItem key={rm.id} value={String(rm.id)}>
                {rm.name} (Stock: {rm.stock_quantity})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label htmlFor='required-quantity'>Required Quantity</Label>
        <Input
          id='required-quantity'
          type='number'
          placeholder='Quantity required'
          value={quantityRequired}
          onChange={(e) => setQuantityRequired(Number(e.target.value))}
        />

        <Button type='button' onClick={handleAddMaterial}>
          Add Material
        </Button>

        {formData.RawMaterials.length > 0 && (
          <div className='space-y-2'>
            {formData.RawMaterials.map((m) => {
              const material = rawMaterials.find((rm) => rm.id === m.id);

              const nameDisplay =
                material?.name ?? `Unknown material (${m.id})`;
              const qty = m.ProductRawMaterial?.required_quantity ?? "?";

              return (
                <div
                  key={m.id}
                  className='flex justify-between items-center border rounded p-2'
                >
                  <span>
                    {nameDisplay} — {qty}
                  </span>

                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    onClick={() => handleRemoveMaterial(m.id)}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className='flex gap-2'>
        <Button type='submit' disabled={isLoading} className='flex-1'>
          Save Product
        </Button>

        {onCancel && (
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            className='flex-1'
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
