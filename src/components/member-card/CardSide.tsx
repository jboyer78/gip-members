import { ReactNode } from "react";

interface CardSideProps {
  children: ReactNode;
}

export const CardSide = ({ children }: CardSideProps) => {
  return (
    <div className="h-full p-6">
      <div className="relative h-full bg-white rounded-xl shadow-xl p-8">
        {children}
      </div>
    </div>
  );
};