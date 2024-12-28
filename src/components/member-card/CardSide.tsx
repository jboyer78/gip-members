import { ReactNode } from "react";

interface CardSideProps {
  children: ReactNode;
}

export const CardSide = ({ children }: CardSideProps) => {
  return (
    <div className="relative h-full bg-white rounded-xl shadow-xl p-8 sm:p-8">
      {children}
    </div>
  );
};