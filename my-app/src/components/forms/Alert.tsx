// AlertDialogComponent.tsx
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AlertDialogComponentProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const AlertDialogComponent: React.FC<AlertDialogComponentProps> = ({
  isOpen,
  onOpenChange,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Success!</AlertDialogTitle>
          <AlertDialogDescription>
            You have successfully registered. Please login to proceed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            <Link href={"/auth/login"}>Login</Link>
          </AlertDialogCancel>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogComponent;
