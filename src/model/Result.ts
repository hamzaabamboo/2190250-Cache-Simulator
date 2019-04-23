import { Config } from "./Config";

export interface Result extends Config {
  hit: number;
  miss: number;
  missRate: string;
}
