import { ShippingAddress } from "@/lib/models/OrderModel";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function AddressList() {
  const router = useRouter();
  const { data: addresses } = useSWR("/api/addresses/mine");

  const handleSetSelectedAddress = async (id: string) => {
    await fetch("/api/addresses/mine/selected", {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
    router.push("/shipping");
  };

  const handleDeleteAddress = async (id: string) => {
    await fetch(`/api/addresses/mine`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    router.push("/shipping");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Addresses</h1>
      <div className="space-y-4">
        {addresses.map((address: any) => (
          <div
            key={address._id}
            className={`card w-full bg-base-100 shadow-lg p-4 rounded-lg border ${
              address.is_default ? "border-primary" : "border-gray-300"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{address.fullName}</p>
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.postalCode}, {address.country}
                </p>
                <p>Email: {address.email}</p>
                <p>Phone: {address.phone}</p>
                {address.is_default && (
                  <span className="badge badge-primary">Default Address</span>
                )}
              </div>
              <div className="space-x-2">
                <button
                  className="btn btn-outline btn-primary btn-sm"
                  onClick={() => handleSetSelectedAddress(address._id)}
                  disabled={address.is_default}
                >
                  Set as Default
                </button>
                <button
                  className="btn btn-outline btn-secondary btn-sm"
                  onClick={() => router.push(`/shipping`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline btn-error btn-sm"
                  onClick={() => handleDeleteAddress(address._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
