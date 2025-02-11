export class EmployeeResponseDTO {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: string;

  constructor(employee: any) {
    this.id = employee.id;
    this.firstName = employee.firstName;
    this.lastName = employee.lastName;
    this.email = employee.email.toString();
    this.role = employee.role;
  }
}
