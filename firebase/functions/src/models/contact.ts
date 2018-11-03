export interface Contact {
  name: string;
  nem: {
    name: string,
    address: string
  }[];
  memo: string;
  tags: string[]
}