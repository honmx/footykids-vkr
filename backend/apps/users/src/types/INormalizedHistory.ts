import { IPersonTrainingWithIsAccountable } from "./IPersonTrainingWithIsAccountable";

export interface INormalizedHistory {
  [userId: string]: IPersonTrainingWithIsAccountable[][];
}