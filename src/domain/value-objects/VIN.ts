import { InvalidVINError } from '../errors/value-objects/vin/InvalidVINError';

export class VIN {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): VIN {
    if (!value?.trim()) {
      throw new InvalidVINError('VIN is required');
    }

    const cleanVIN = value.trim().toUpperCase();

    if (!this.isValidLength(cleanVIN)) {
      throw new InvalidVINError('VIN must be exactly 17 characters long');
    }

    if (!this.isValidFormat(cleanVIN)) {
      throw new InvalidVINError('VIN contains invalid characters');
    }

    if (!this.isValidChecksum(cleanVIN)) {
      throw new InvalidVINError('VIN checksum is invalid');
    }

    return new VIN(cleanVIN);
  }

  private static isValidLength(vin: string): boolean {
    return vin.length === 17;
  }

  private static isValidFormat(vin: string): boolean {
    // Caractères valides pour un VIN (excluant I, O, Q pour éviter la confusion)
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    return vinRegex.test(vin);
  }

  private static isValidChecksum(vin: string): boolean {
    // Table de conversion des caractères en valeurs numériques
    const vinValues: { [key: string]: number } = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7,
      H: 8,
      J: 1,
      K: 2,
      L: 3,
      M: 4,
      N: 5,
      P: 7,
      R: 9,
      S: 2,
      T: 3,
      U: 4,
      V: 5,
      W: 6,
      X: 7,
      Y: 8,
      Z: 9,
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '0': 0,
    };

    // Poids pour chaque position
    const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

    // Calcul de la somme pondérée
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      const char = vin[i];
      const value = vinValues[char];
      sum += value * weights[i];
    }

    // Calcul du caractère de contrôle (position 9)
    const remainder = sum % 11;
    const checkDigit = remainder === 10 ? 'X' : remainder.toString();

    return vin[8] === checkDigit;
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: VIN): boolean {
    return this.value === other.value;
  }

  // Méthode utilitaire pour extraire des informations du VIN
  public getManufacturer(): string {
    return this.value.slice(0, 3);
  }

  public getModelYear(): string {
    return this.value[9];
  }

  public getPlantCode(): string {
    return this.value[10];
  }

  public getSerialNumber(): string {
    return this.value.slice(11);
  }
}
