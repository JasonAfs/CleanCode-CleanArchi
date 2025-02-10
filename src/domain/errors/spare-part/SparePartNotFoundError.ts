export class SparePartNotFoundError extends Error {
  constructor(reference: string) {
    super(`Spare part with reference ${reference} not found`);
    this.name = 'SparePartNotFoundError';
  }
}
