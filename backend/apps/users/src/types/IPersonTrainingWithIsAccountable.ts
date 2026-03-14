export interface IPersonTrainingWithIsAccountable {
  id: number;
  attendance: "П" | "УП" | "НП" | "Б" | "ОТ";
  training: {
    id: number;
    date: string;
  };
  isAccountable: boolean;
}