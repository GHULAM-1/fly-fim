import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useParams();
  const { city, category, subcategory, itemId } = params;

  // For demonstration, you might fetch experience details by itemId here
  // For now, just display the route params

  return (
    <div className="max-w-xl mx-auto mt-20 p-8 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Checkout Page</h1>
      <p className="text-lg">
        You're now at the checkout page of <span className="font-semibold">{itemId}</span> <br />
        in category <span className="font-semibold">{category}</span> <br />
        in subcategory <span className="font-semibold">{subcategory}</span> <br />
        in <span className="font-semibold">{city}</span>
      </p>
    </div>
  );
}
