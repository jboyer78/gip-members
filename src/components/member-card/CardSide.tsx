import { ReactNode } from "react";

interface CardSideProps {
  children: ReactNode;
}

export const CardSide = ({ children }: CardSideProps) => {
  return (
    <div className="relative h-full bg-white rounded-xl shadow-xl p-0 sm:p-1">
      {children}
    </div>
  );
};