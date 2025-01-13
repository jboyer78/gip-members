import { supabase } from "@/integrations/supabase/client";
import { BankingFormValues } from "../types";

export const fetchUserBankingInfo = async (userId: string) => {
  const { data, error } = await supabase
    .from("banking_info")
    .select("iban, bic, authorize_debit")
    .eq("profile_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const checkExistingBankingInfo = async (userId: string) => {
  const { data, error } = await supabase
    .from("banking_info")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateBankingInfo = async (userId: string, values: BankingFormValues) => {
  const { error } = await supabase
    .from("banking_info")
    .update({ 
      ...values,
      updated_at: new Date().toISOString(),
    })
    .eq("profile_id", userId);

  if (error) throw error;
};

export const insertBankingInfo = async (userId: string, values: BankingFormValues) => {
  const { error } = await supabase
    .from("banking_info")
    .insert({ 
      ...values,
      profile_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
};