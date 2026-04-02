import { IGroup } from "@/types/IGroup";

export const getJoinedByCommaUserGroups = (groups: Pick<IGroup, "id" | "name" | "amountOfTrainingsInSubscription">[] | null) => {
  if (!groups) return "";
  
  return groups.map(group => group.name).join(", ");
}