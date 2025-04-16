
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Template } from "@/types/chat";

interface TemplatePreviewDialogProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

const TemplatePreviewDialog = ({ template, isOpen, onClose }: TemplatePreviewDialogProps) => {
  if (!template) return null;

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const formatTemplateText = (text: string) => {
    if (!text) return "";
    return text.replace(/{{(\d+)}}/g, (_, num) => {
      return `<span class="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">Variable ${num}</span>`;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{template.name}</DialogTitle>
            <Badge variant="outline" className={getStatusBadgeClass(template.status)}>
              {template.status}
            </Badge>
          </div>
          <DialogDescription>
            Category: {template.category} | Language: {template.language}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Preview Section */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="text-md font-medium">Template Preview</h3>
            </div>
            <div className="p-4 space-y-6">
              {/* Header */}
              {template.header_text && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Header:</p>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatTemplateText(template.header_text),
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Body:</p>
                <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatTemplateText(template.body_text),
                    }}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Footer */}
              {template.footer_text && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Footer:</p>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatTemplateText(template.footer_text),
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Has Buttons */}
              {template.has_buttons > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Buttons:</p>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm">Template has {template.has_buttons} button(s)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Template Details Section */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="text-md font-medium">Additional Details</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Template ID:</p>
                  <p className="text-sm">{template.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Meta Template ID:</p>
                  <p className="text-sm">{template.meta_template_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created:</p>
                  <p className="text-sm">{new Date(template.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated:</p>
                  <p className="text-sm">{new Date(template.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
