'use client'

type StatusFilter = 'pending' | 'paid' | 'reject' | 'expired' | 'all';

interface TransactionFilterProps {
    currentFilter: StatusFilter;
    onFilterChange: (newStatus: StatusFilter) => void;
}

export default function TransactionFilter({ currentFilter, onFilterChange }: TransactionFilterProps) {
    const statuses: StatusFilter[] = ['all', 'pending', 'paid', 'reject', 'expired'];
    return (
        <select
            value={currentFilter}
            onChange={(e) => onFilterChange(e.target.value as StatusFilter)}
            className="border p-2 rounded-md text-sm bg-gray-50 focus:outline-none"
        >
            {statuses.map(status => (
                <option key={status} value={status} className="capitalize">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
            ))}
        </select>
    );
}
