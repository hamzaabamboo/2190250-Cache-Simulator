import { Config } from "../model/Config";

import { DMCache } from "../model/DMCache";

export const createCache = (config: Config): DMCache => {
  const cache: DMCache = { blocks: [] };
  for (let block = 0; block < config.associativity; block++) {
    cache.blocks = [];
    for (let i = 0; i < config.cacheSize / config.blockSize; i++) {
      cache.blocks[i] = { tag: 0, data: [], valid: false, dirty: false };
    }
  }
  return cache;
};
