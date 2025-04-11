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
import { format } from "date-fns";
import FormActions from "./FormActions";
import { Form } from "@/app/forms/page";
import { StatusSwitcher } from "./FormStatusToggle";

export default function FormListView({ forms }: { forms: Form[] }) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <TableRow key={form._id}>
              <TableCell>{form.title}</TableCell>

              <TableCell className="capitalize">
                <StatusSwitcher
                  formId={form._id}
                  currentStatus={form.status}
                  onStatusChange={(newStatus) => {
                    form.status = newStatus;
                  }}
                />
              </TableCell>

              <TableCell>{form.config.elements.length}</TableCell>

              <TableCell>
                {format(new Date(form.createdAt), "MMM d, yyyy")}
              </TableCell>

              <TableCell>
                <FormActions form={form} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
