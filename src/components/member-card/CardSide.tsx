import { ReactNode } from "react";

interface CardSideProps {
  children: ReactNode;
}

export const CardSide = ({ children }: CardSideProps) => {
  return (
    <div className="relative h-full bg-white rounded-xl shadow-xl p-1 sm:p-4">
      {children}
    </div>
  );
};