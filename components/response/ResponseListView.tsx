"use client";

import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Response } from "@/app/responses/page";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export default function ResponseListView({ responses }: { responses: Response[] }) {
    const router = useRouter();

    const handleViewResponse = (id: string) => {
        router.push(`/responses/${id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="p-6 shadow-md border border-border bg-background/70 rounded-2xl">
                <h2 className="text-xl font-bold text-foreground mb-4">All Responses</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Form Title</TableHead>
                            <TableHead>Questions</TableHead>
                            <TableHead>Submitted At</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {responses.length > 0 ? (
                            responses.map((res: any) => (
                                <TableRow key={res._id}>
                                    <TableCell>{res.form?.title || "Untitled Form"}</TableCell>
                                    <TableCell>{Object.keys(res.data || {}).length}</TableCell>
                                    <TableCell>{format(new Date(res.submittedAt), "PPP")}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" className="w-fit gap-2" onClick={() => handleViewResponse(res._id)} >
                                            <Eye className="h-4 w-4" /> View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                    No responses found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </motion.div>
    );
}
