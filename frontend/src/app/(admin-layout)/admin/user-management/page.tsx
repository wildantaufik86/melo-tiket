import AdminUserDisplay from "@/components/admin/users/AdminUserDisplay";
import BreadCrumb, { BreadCrumbItem } from "@/components/navigation/BreadCrumb";
import { UsersIcon } from "@phosphor-icons/react/dist/ssr";

export default function AdminUserPage() {
    const breadcrumbItems: BreadCrumbItem[] = [
        { label: "Dashboard", href: "/admin/homepage" },
        { label: "User Management" }
    ];

    return (
        <section>
            <div className="flex items-center gap-2">
                <UsersIcon size={24}/>
                <BreadCrumb items={breadcrumbItems} />
            </div>
            <AdminUserDisplay />
        </section>
    );
}
