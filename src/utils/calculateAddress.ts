import { Config } from "../model/Config";

export const calculateAddress = (config: Config) => (addr: number) => {
  const INDEX_SIZE = config.cacheSize / config.blockSize;
  const INDEXLEN = Math.log2(INDEX_SIZE);
  const OFFSETLEN = Math.log2(config.blockSize);
  const TAGLEN = 32 - INDEXLEN - OFFSETLEN;

  let tmp;
  let i;

  const tag = addr >> (OFFSETLEN + INDEXLEN);
  tmp = 0;

  for (i = 0; i < INDEXLEN; i++) {
    tmp <<= 1;
    tmp |= 0x01;
  }
  const idx = (addr >> OFFSETLEN) & tmp;
  tmp = 0;
  for (i = 0; i < OFFSETLEN; i++) {
    tmp <<= 1;
    tmp |= 0x01;
  }
  const offset = addr & tmp;
  return { tag, idx, offset };
};
