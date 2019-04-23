import { DMCache } from "./DMCache";
import { Config } from "./Config";

export interface ASCache<Cache extends DMCache> {
  sets: Cache[];

  access(config: Config): (address: number) => { hit: number; miss: number };
}
