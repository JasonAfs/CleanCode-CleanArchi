import { EmployeeResponseDTO } from './employee.response.dto';
import { OperationResultResponseDTO } from './operation-result.response.dto';

export class EmployeeOperationResponseDTO extends OperationResultResponseDTO {
  employee?: EmployeeResponseDTO;

  constructor(message: string, employee?: any) {
    super(message, true);
    if (employee) {
      this.employee = new EmployeeResponseDTO(employee);
    }
  }
}
