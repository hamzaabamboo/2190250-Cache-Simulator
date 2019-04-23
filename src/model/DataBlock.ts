export interface DataBlock {
  tag: number;
  valid: boolean;
  dirty: boolean;
  data?: number[];
}
