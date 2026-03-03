import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RawMaterial } from "@/types/RawMaterial";
import type { RawMaterialInput } from "@/types/RawMaterialInput";
import { useRawMaterials } from "@/hooks/rawMaterial";

interface Props {
  initialData?: RawMaterial;
  onSubmit: (data: RawMaterialInput) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function RawMaterialForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}: Props) {
  const { data: rawMaterials = [] } = useRawMaterials();

  const emptyForm: RawMaterialInput = {
    code: "",
    name: "",
    stock_quantity: 0,
  };

  const [formData, setFormData] = useState<RawMaterialInput>(
    initialData ?? emptyForm,
  );

  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(initialData ?? emptyForm);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock_quantity" ? Number(value) : value,
    }));

    if (name === "code") {
      const exists = rawMaterials.some(
        (rm) => rm.code === value && rm.id !== initialData?.id,
      );
      setCodeError(exists ? "Code already exists" : null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (codeError) return;

    onSubmit(formData);

    if (!initialData) {
      setFormData(emptyForm);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 border rounded p-4 max-w-md'
    >
      <div>
        <Label htmlFor='code'>Code</Label>
        <Input
          id='code'
          name='code'
          value={formData.code}
          onChange={handleChange}
          required
          placeholder='RM-000'
        />
        {codeError && <p className='text-red-500 text-sm mt-1'>{codeError}</p>}
      </div>

      <div>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          required
          placeholder='Iron'
        />
      </div>

      <div>
        <Label htmlFor='stock_quantity'>Stock Quantity</Label>
        <Input
          id='stock_quantity'
          type='number'
          name='stock_quantity'
          value={formData.stock_quantity}
          onChange={handleChange}
          required
          min={0}
        />
      </div>

      <div className='flex gap-2'>
        <Button type='submit' disabled={isLoading} className='flex-1'>
          Save Raw Material
        </Button>
        {onCancel && (
          <Button
            type='button'
            variant='outline'
            className='flex-1'
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
