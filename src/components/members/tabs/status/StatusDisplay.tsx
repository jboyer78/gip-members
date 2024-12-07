import { CheckCircle, XCircle } from "lucide-react";

interface StatusDisplayProps {
  currentStatus: string | undefined;
  latestComment?: string;
}

export const StatusDisplay = ({ currentStatus, latestComment }: StatusDisplayProps) => {
  return (
    <div className="p-6 rounded-lg border bg-muted/50 space-y-4">
      <div className="flex items-center gap-2">
        {currentStatus ? (
          <>
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">{currentStatus}</span>
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-muted-foreground">Aucun statut défini</span>
          </>
        )}
      </div>
      {latestComment && (
        <p className="text-sm text-muted-foreground border-t pt-4">
          Dernier commentaire : {latestComment}
        </p>
      )}
    </div>
  );
};