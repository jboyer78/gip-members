import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const MemberTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Photo</TableHead>
        <TableHead>Prénom</TableHead>
        <TableHead>Nom</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Âge</TableHead>
        <TableHead>Grade</TableHead>
        <TableHead>Service</TableHead>
        <TableHead>Direction</TableHead>
        <TableHead>Informations personnelles</TableHead>
        <TableHead>Informations professionnelles</TableHead>
        <TableHead>Informations bancaires</TableHead>
        <TableHead>Date de création</TableHead>
        <TableHead>Dernière modification</TableHead>
        <TableHead>Date de bannissement</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};