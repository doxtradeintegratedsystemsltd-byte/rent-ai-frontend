import { RefObject } from "react";
import { useReactToPrint } from "react-to-print";

export const PrintStyles = {
  smallReceipt: "print-receipt",
  receipt: "print-receipt-standard",
  invoice: "print-invoice",
  report: "print-report",
} as const;

interface UsePrintOptions {
  documentTitle?: string;
  pageMargin?: string;
  additionalClass?: string;
  removeElementsWithAttribute?: string;
}

const usePrint = (
  componentRef: RefObject<HTMLElement | null>,
  options: UsePrintOptions = {},
) => {
  const {
    documentTitle = "Rent Management System",
    pageMargin = "20mm",
    additionalClass,
    removeElementsWithAttribute = "data-no-print",
  } = options;

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle,
    pageStyle: `
            @page {
                margin: ${pageMargin};
                size: auto;
            }
            @media print {
                body { -webkit-print-color-adjust: exact; }
                .print-receipt { 
                    font-size: 12px; 
                    max-width: 300px;
                }
                .print-receipt-standard { 
                    font-size: 14px; 
                    max-width: 400px;
                }
                .print-invoice { 
                    font-size: 13px; 
                }
                .print-report { 
                    font-size: 11px; 
                }
                [data-no-print] {
                    display: none !important;
                }
            }
        `,
    onBeforePrint: async () => {
      if (!componentRef.current) return;

      // Add additional class for print styling if provided
      if (additionalClass) {
        componentRef.current.classList.add(additionalClass);
      }
    },
    onAfterPrint: async () => {
      if (!componentRef.current) return;

      // Clean up - remove the additional class after printing
      if (additionalClass) {
        componentRef.current.classList.remove(additionalClass);
      }
    },
  });

  return handlePrint;
};

export default usePrint;
