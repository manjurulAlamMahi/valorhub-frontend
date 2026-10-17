// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { cn } from "@/lib/utils";
// import type { PropsWithChildren } from "react";
// import useQueryParams from "./useModal";

// interface ModalProps {
//   modalId: string;
//   openId: string;
//   closeModals?: string[];
//   className?: string;
// }

// export default function Modal({
//   openId,
//   modalId,
//   children,
//   closeModals,
//   className,
// }: PropsWithChildren<ModalProps>) {
//   const { getQuery, removeQuery, setQuery } = useQueryParams();
//   const modal = getQuery(modalId);

//   const handleOpenChange = (open: boolean) => {
//     if (open) {
//       setQuery([{ queryId: modalId, queryValue: openId }]);
//     } else {
//       removeQuery([modalId]);
//       if (closeModals && closeModals.length > 0) {
//         closeModals.forEach((id) => removeQuery([id]));
//       }
//     }
//   };

//   return (
//     <Dialog open={modal === openId} onOpenChange={handleOpenChange}>
//       <DialogTrigger asChild hidden />
//       <DialogContent
//         className={cn(
//           "min-h-auto min-w-fit border-none bg-transparent p-0 shadow-none",
//           className,
//         )}
//       >
//         <DialogHeader hidden>
//           <DialogTitle hidden />
//           <DialogDescription hidden />
//         </DialogHeader>
//         {children}
//         <DialogFooter hidden />
//       </DialogContent>
//     </Dialog>
//   );
// }
