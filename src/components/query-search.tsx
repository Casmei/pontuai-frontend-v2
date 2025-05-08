import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ChangeEvent, useEffect, useState } from "react";

export function QuerySearch({ placeholder, callBack }: { placeholder?: string, callBack: (q: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleChange = (e: ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    callBack(debouncedSearchTerm)

  }, [debouncedSearchTerm]);


  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-8"
        onChange={(e) => { handleChange(e) }}
      />
    </div>
  )
}
