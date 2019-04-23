import { ASCache } from "./ASCache";

import { DMCache } from "./DMCache";

import { Config } from "./Config";

import { calculateAddress } from "../utils/calculateAddress";
import { createCache } from "../utils/createCache";

export class RRASCache implements ASCache<DMCache> {
  sets: DMCache[] = [];
  counter: number[];

  constructor(config: Config) {
    this.counter = Array<number>(config.cacheSize / config.blockSize).fill(0);
    for (let set = 0; set < config.associativity; set++) {
      this.sets[set] = createCache(config);
    }
  }

  access(config: Config) {
    return (addr: number) => {
      const { tag, idx, offset } = calculateAddress(config)(addr);
      const blocks = this.sets.map(s => s.blocks[idx]);
      const tgt = blocks.map(b => b.tag).findIndex(t => t == tag);
      let res = { hit: 0, miss: 0 };
      if (tgt != -1 && blocks[tgt].valid) {
        res = { hit: 1, miss: 0 };
      } else {
        const ctr = this.counter[idx];
        this.sets[ctr].blocks[idx].valid = true;
        this.sets[ctr].blocks[idx].dirty = true;
        this.sets[ctr].blocks[idx].tag = tag;
        this.counter[idx] = (ctr + 1) % config.associativity;
        res = { hit: 0, miss: 1 };
      }
      return res;
    };
  }
}
