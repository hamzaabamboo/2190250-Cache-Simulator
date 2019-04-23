import { ASCache } from "./ASCache";

import { Config } from "./Config";

import { DMCache } from "./DMCache";

import { calculateAddress } from "../utils/calculateAddress";
import { createCache } from "../utils/createCache";
import { DataBlock } from "./DataBlock";

export class LRUASCache implements ASCache<LRUCache> {
  sets: LRUCache[] = [];

  constructor(config: Config) {
    for (let set = 0; set < config.associativity; set++) {
      this.sets[set] = {
        blocks: createCache(config).blocks.map(c => ({ ...c, age: 0 }))
      };
    }
  }

  access(config: Config) {
    return (addr: number) => {
      const { tag, idx, offset } = calculateAddress(config)(addr);
      const blocks = this.sets.map(s => s.blocks[idx]);
      const tgt = blocks.map(b => b.tag).findIndex(t => t == tag);
      let res = { hit: 0, miss: 0 };
      if (tgt != -1 && blocks[tgt].valid) {
        this.sets[tgt].blocks[idx].age = -1;
        res = { hit: 1, miss: 0 };
      } else {
        const lr = blocks.reduce(
          (p, b, i) => (blocks[p].age > blocks[i].age ? p : i),
          0
        );
        this.sets[lr].blocks[idx].valid = true;
        this.sets[lr].blocks[idx].dirty = true;
        this.sets[lr].blocks[idx].tag = tag;
        this.sets[lr].blocks[idx].age = -1;
        res = { hit: 0, miss: 1 };
      }
      for (let i = 0; i < this.sets.length; i++) {
        this.sets[i].blocks[idx].age++;
      }
      return res;
    };
  }
}

export interface LRUCache extends DMCache {
  blocks: LRUDataBlock[];
}

interface LRUDataBlock extends DataBlock {
  age: number;
}
