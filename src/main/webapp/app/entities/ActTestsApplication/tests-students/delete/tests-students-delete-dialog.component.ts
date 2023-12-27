import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITestsStudents } from '../tests-students.model';
import { TestsStudentsService } from '../service/tests-students.service';

@Component({
  standalone: true,
  templateUrl: './tests-students-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TestsStudentsDeleteDialogComponent {
  testsStudents?: ITestsStudents;

  constructor(
    protected testsStudentsService: TestsStudentsService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.testsStudentsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
