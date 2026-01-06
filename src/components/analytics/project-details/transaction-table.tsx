import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Transaction } from "@/components/analytics/data/mock-projects"

interface TransactionTableProps {
    transactions?: Transaction[]
}

export function TransactionTable({ transactions = [] }: TransactionTableProps) {
    if (!transactions.length) {
        return (
            <div className="w-full py-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                <p className="text-muted-foreground">No recent transaction data available.</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-white/10 overflow-hidden">
            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="hover:bg-white/5 border-white/10">
                        <TableHead className="text-muted-foreground font-medium">Unit</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Type</TableHead>
                        <TableHead className="text-right text-muted-foreground font-medium">Size (sq.ft)</TableHead>
                        <TableHead className="text-right text-muted-foreground font-medium">Price (AED)</TableHead>
                        <TableHead className="text-right text-muted-foreground font-medium">Psf (AED)</TableHead>
                        <TableHead className="text-right text-muted-foreground font-medium">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((tx, i) => (
                        <TableRow key={i} className="hover:bg-white/5 border-white/5 transition-colors">
                            <TableCell className="font-semibold text-foreground">{tx.unit}</TableCell>
                            <TableCell className="text-muted-foreground">{tx.type}</TableCell>
                            <TableCell className="text-right text-muted-foreground tabular-nums">
                                {tx.size.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-medium tabular-nums">
                                {tx.price.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground tabular-nums">
                                {Math.round(tx.price / tx.size).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground tabular-nums">
                                {tx.date}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
