import { NoteService } from './../../core/service/note.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/core/interface/user';

interface DialogData {
  title: string;
  content: string;
  _id?: string;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  noteForm = new FormGroup({
    title: new FormControl(this.data.title ? this.data.title : '', [
      Validators.required,
    ]),
    content: new FormControl(this.data.content ? this.data.content : '', [
      Validators.required,
    ]),
  });

  constructor(private _NoteService: NoteService) {}

  handleForm(form: FormGroup) {
    if (form.valid) {
      if (!this.data._id) {
        this.addNewNote(form.value);
      } else {
        this.updateNote(form.value);
      }
    } else {
      this.noteForm.markAllAsTouched(); // Show validation errors
    }
  }

  addNewNote(newNote: User) {
    this._NoteService.ADDNote(newNote).subscribe({
      next: (response) => {
        if (response.msg === 'done') {
          console.log(response);
          this.dialogRef.close();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  updateNote(newNote: User) {
    this._NoteService.UpdateUserNote(newNote, this.data._id!).subscribe({
      next: (response) => {
        if (response.msg === 'done') {
          console.log(response);
          this.dialogRef.close();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
