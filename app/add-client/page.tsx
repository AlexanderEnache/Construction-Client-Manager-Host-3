import { AddClientForm } from "@/components/AddClientForm";

export default function AddClientPage() {
  return (
    <div className="flex justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <AddClientForm />
      </div>
    </div>
  );
}
