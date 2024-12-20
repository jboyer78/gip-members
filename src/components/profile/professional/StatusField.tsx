import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../types";
import { getBaseMembershipFee, HONORARY_MEMBER_MIN_DONATION } from "@/utils/membershipFees";
import { useState } from "react";

const statusOptions = [
  "Actif",
  "Retraité(e) depuis moins de 6 ans",
  "Retraité(e) depuis 6 ans et plus",
  "Élève",
  "Membre fondateur",
  "Membre d'honneur"
].sort();

interface StatusFieldProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StatusField = ({ form }: StatusFieldProps) => {
  const [donationAmount, setDonationAmount] = useState<string>("");
  const currentStatus = form.watch("professional_status")?.[0];
  const isHonoraryMember = currentStatus === "Membre d'honneur";
  const baseFee = getBaseMembershipFee(currentStatus);

  const handleDonationChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setDonationAmount(numericValue);
  };

  const getDonationValidationMessage = (): string | null => {
    if (!isHonoraryMember || !donationAmount) return null;
    const amount = parseInt(donationAmount);
    if (isNaN(amount) || amount < HONORARY_MEMBER_MIN_DONATION) {
      return `Le don minimum pour un membre d'honneur est de ${HONORARY_MEMBER_MIN_DONATION}€`;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="professional_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Situation professionnelle</FormLabel>
            <Select 
              onValueChange={(value) => field.onChange([value])} 
              value={field.value?.[0] || ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre situation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {currentStatus && !isHonoraryMember && (
        <div className="text-sm">
          <span className="font-medium">Cotisation annuelle : </span>
          <span className="text-primary">{baseFee}€</span>
        </div>
      )}

      {isHonoraryMember && (
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Montant du don</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="text"
                  value={donationAmount}
                  onChange={(e) => handleDonationChange(e.target.value)}
                  placeholder={`Minimum ${HONORARY_MEMBER_MIN_DONATION}€`}
                  className="pr-6"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2">€</span>
              </div>
            </FormControl>
            {getDonationValidationMessage() && (
              <p className="text-sm text-destructive mt-1">
                {getDonationValidationMessage()}
              </p>
            )}
          </FormItem>
          <p className="text-sm text-muted-foreground">
            En tant que membre d'honneur, vous pouvez choisir le montant de votre don
            (minimum {HONORARY_MEMBER_MIN_DONATION}€)
          </p>
        </div>
      )}
    </div>
  );
};