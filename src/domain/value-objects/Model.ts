import { MotorcycleModel, MODEL_CHARACTERISTICS } from "@domain/enums/MotorcycleEnums";
import { InvalidModelError } from "@domain/errors/motorcycle/InvalidModelError";


export class Model {
    private constructor(
        private readonly _modelType: MotorcycleModel,
        private readonly _year: number,
    ) {}

    public static create(
        modelType: MotorcycleModel,
        year: number,
    ): Model {
        if (!this.isValidYear(year)) {
            throw new InvalidModelError("Invalid year");
        }

        return new Model(modelType, year);
    }

    private static isValidYear(year: number): boolean {
        const currentYear = new Date().getFullYear();
        return year >= 1900 && year <= currentYear + 1;
    }

    get modelType(): MotorcycleModel {
        return this._modelType;
    }

    get year(): number {
        return this._year;
    }

    get displacement(): number {
        return MODEL_CHARACTERISTICS[this._modelType].displacement;
    }

    get category(): string {
        return MODEL_CHARACTERISTICS[this._modelType].category;
    }

    get maintenanceInterval(): number {
        return MODEL_CHARACTERISTICS[this._modelType].maintenanceInterval;
    }

    public toString(): string {
        return `${this._year} ${this._modelType}`;
    }
}