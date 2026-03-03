import { useProductsSuggestion } from "@/hooks/production";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function ProductsSuggestionPage() {
  const { data, isLoading, error } = useProductsSuggestion();

  if (isLoading) {
    return (
      <div className='flex justify-center py-10'>
        <Spinner className='size-12' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-10 text-red-500'>
        Error loading suggestions: {error.message}
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-6xl py-10 space-y-8'>
      <h1 className='text-3xl font-bold tracking-tight'>Product Suggestions</h1>

      {!data?.products || data.products.length === 0 ? (
        <p>No products can be produced with the current stock.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {data.products.map((p: any) => (
            <Card key={p.productId} className='shadow-md'>
              <CardHeader>
                <CardTitle>{p.productName}</CardTitle>
              </CardHeader>

              <CardContent className='space-y-2'>
                <p>Quantity: {p.quantity}</p>
                <p>Unit Price: ${p.unitPrice}</p>
                <p>Total: ${p.total}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data?.totalValue !== undefined && data?.totalValue !== null && (
        <div className='text-right font-semibold text-lg'>
          Total Value: ${data.totalValue}
        </div>
      )}
    </div>
  );
}
