import * as fs from "fs";
import { Config } from "./model/Config";
import { Result } from "./model/Result";
import { DMCache } from "./model/DMCache";
import { createCache } from "./utils/createCache";
import { LRUASCache } from "./model/LRUCache";
import { RRASCache } from "./model/RRASCache";
import { calculateAddress } from "./utils/calculateAddress";
import { toCSV } from "./utils/toCSV";

const FILE = "./gcc_id_trace.txt";

const DMconfigs: Config[] = [1, 4, 8, 16, 32, 64, 128, 256]
  .map(cache =>
    [1, 4, 8, 16, 32, 64, 128, 256].map(block => ({
      cacheSize: cache * 1024,
      blockSize: block,
      associativity: 1
    }))
  )
  .reduce((prev, curr) => [...prev, ...curr], []);

const Aconfigs: Config[] = [1, 2, 4, 8]
  .map(associativity =>
    [1, 4, 8, 16, 32, 64, 128, 256, 512, 1024].map(cacheSize => {
      return {
        cacheSize: cacheSize * 1024,
        blockSize: 32,
        associativity
      };
    })
  )
  .reduce((prev, curr) => [...prev, ...curr], []);
function main() {
  // toCSV(normalCache(), "DMC");
  toCSV(LRUCache(), "LRU");
  toCSV(RRCache(), "RR");
}

const normalCache = (): Result[] => {
  // SIZE INDEX_SIZE
  const res = DMconfigs.map(config => {
    const cache: DMCache = createCache(config);
    const { hit, miss } = fs
      .readFileSync(FILE, "utf-8")
      .split("\n")
      .reduce(
        (prev, line) => {
          let { hit, miss } = prev;
          const addr = parseInt(line, 16);
          const res = accessDM(cache, config)(addr);
          hit += res.hit;
          miss += res.miss;
          return { hit, miss };
        },
        { hit: 0, miss: 0 }
      );
    return {
      ...config,
      hit,
      miss,
      missRate: `${(miss * 100) / (hit + miss)} %`
    };
  });
  return res;
};

const LRUCache = (): Result[] => {
  // SIZE INDEX_SIZE
  const res = Aconfigs.map(config => {
    const cache: LRUASCache = new LRUASCache(config);
    const { hit, miss } = fs
      .readFileSync(FILE, "utf-8")
      .split("\n")
      .reduce(
        (prev, line) => {
          let { hit, miss } = prev;
          const addr = parseInt(line, 16);
          const res = cache.access(config)(addr);
          hit += res.hit;
          miss += res.miss;
          return { hit, miss };
        },
        { hit: 0, miss: 0 }
      );
    return {
      ...config,
      hit,
      miss,
      missRate: `${(miss * 100) / (hit + miss)} %`
    };
  });
  return res;
};

const RRCache = (): Result[] => {
  // SIZE INDEX_SIZE
  const res = Aconfigs.map(config => {
    const cache: RRASCache = new RRASCache(config);
    const { hit, miss } = fs
      .readFileSync(FILE, "utf-8")
      .split("\n")
      .reduce(
        (prev, line) => {
          let { hit, miss } = prev;
          const addr = parseInt(line, 16);
          const res = cache.access(config)(addr);
          hit += res.hit;
          miss += res.miss;
          return { hit, miss };
        },
        { hit: 0, miss: 0 }
      );
    return {
      ...config,
      hit,
      miss,
      missRate: `${(miss * 100) / (hit + miss)} %`
    };
  });
  return res;
};

const accessDM = (cache: DMCache, config: Config) => (addr: number) => {
  const { tag, idx, offset } = calculateAddress(config)(addr);
  if (cache.blocks[idx].tag == tag && cache.blocks[idx].valid) {
    return { hit: 1, miss: 0 };
  } else {
    cache.blocks[idx].valid = true;
    cache.blocks[idx].dirty = true;
    cache.blocks[idx].tag = tag;
    return { hit: 0, miss: 1 };
  }
};

main();
