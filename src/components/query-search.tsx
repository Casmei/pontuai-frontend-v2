"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function QuerySearch({ placeholder }: { placeholder?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = (searchTerm: string) => {
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
            params.set("q", searchTerm)
        } else {
            params.delete("q")
        }

        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                defaultValue={searchParams.get("q")?.toString()}
                placeholder={placeholder}
                className="pl-8"
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
}
