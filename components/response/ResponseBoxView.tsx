"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Response } from "@/app/responses/page";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export default function ResponseBoxView({ responses }: { responses: Response[] }) {
    const router = useRouter();

    const handleViewResponse = (id: string) => {
        router.push(`/responses/${id}`);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {responses.length > 0 ? (
                responses.map((res: any, i) => (
                    <motion.div
                        key={res._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="p-5 shadow-lg border border-border bg-gradient-to-br from-muted/30 to-muted/10 hover:shadow-xl rounded-2xl transition-all duration-300">
                            <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">
                                {res.form?.title || "Untitled Form"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                                Questions : {Object.keys(res.data || {}).length}
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                                Submitted on {format(new Date(res.submittedAt), "PPP")}
                            </p>
                            <Button variant="outline" className="w-fit gap-2" onClick={() => handleViewResponse(res._id)} >
                                <Eye className="h-4 w-4" /> View
                            </Button>
                        </Card>
                    </motion.div>
                ))
            ) : (
                <div className="col-span-full text-center text-muted-foreground py-10">
                    No responses found.
                </div>
            )}
        </div>
    );
}
