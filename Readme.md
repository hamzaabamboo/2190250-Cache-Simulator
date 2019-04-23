# Cache Simulator

Part of 2190250 Computer Architecture and Organization Assignment 2
It's actually Aj's version rewritten 

## Features

- Direct Mapped Cache 
- Associative Cache with 
  - Least Recently Used Replacement Algorithm [LRUASCache.ts](./src/model/LRUASCache.ts)
  - Round Robin Replacement Algorithm [RRASCache.ts](./src/model/RRASCache.ts)

## Running

```bash
yarn start
```

This will generate `.csv` files wil be out in `/out`

## Dev

```bash
yarn dev
```

This project uses `nodemon` with `ts-node`