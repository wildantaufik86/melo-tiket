import BreadCrumb, { BreadCrumbItem } from "@/components/navigation/BreadCrumb";
import CreateTransactionForm from "@/components/admin/transaction/CreateTransactionForm";
import { HouseIcon } from "@phosphor-icons/react/dist/ssr";

export default function NewTransactionByAdminPage() {
    const breadcrumbItems: BreadCrumbItem[] = [
        { label: "Dashboard", href: "/admin/homepage", icon: <HouseIcon size={16} /> },
        { label: "Transaction Management", href: "/admin/transactions" },
        { label: "New Purchase by Admin" }
    ];

    return (
        <section>
            <BreadCrumb items={breadcrumbItems} />
            <div className="w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200">
                <h1 className="text-xl font-extrabold text-gray-900 mb-6">Create New Purchase</h1>
                <CreateTransactionForm />
            </div>
        </section>
    );
}
