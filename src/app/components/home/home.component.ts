import { NoteService } from './../../core/service/note.service';
import { DialogComponent } from './../dialog/dialog.component';
import { Router } from '@angular/router';
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from 'src/app/core/interface/user';
import Swal from 'sweetalert2';
import { SearchPipe } from 'src/app/core/pipe/search.pipe';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    DialogComponent,
    SearchPipe,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  notes: User[] = [];
  searchValue: string = '';
  id_done: any[] = [];

  constructor(
    private _Router: Router,
    public dialog: MatDialog,
    private _NoteService: NoteService,
    private _Renderer2: Renderer2,
    private _ElementRef: ElementRef,
    private toastr: ToastrService
  ) {
    // Load id_done from local storage if available
    const savedIds = localStorage.getItem('id_done');
    if (savedIds) {
      this.id_done = JSON.parse(savedIds);
    }
  }

  ngOnInit(): void {
    this._NoteService.getUserNote().subscribe({
      next: (response) => {
        if (response.msg === 'done') {
          this.notes = response.notes;
          this.applyStylesToDoneNotes();
        }
      },
    });
  }

  done(): void {
    this.toastr.success('Your task successfully done.');
    console.log('hi');
  }

  toggleDone(note: User, element: any): void {
    this.done();
    note.done = !note.done;

    if (note.done) {
      // Hide the button if done
      this._Renderer2.setStyle(element, 'display', 'none');
      if (!this.id_done.includes(note._id)) {
        this.id_done.push(note._id); // Add id to the array
      }
    } else {
      // Show the button if not done
      this._Renderer2.setStyle(element, 'display', '');
      const index = this.id_done.indexOf(note._id);
      if (index > -1) {
        this.id_done.splice(index, 1); // Remove id from the array if not done
      }
    }

    // Save id_done array to local storage
    localStorage.setItem('id_done', JSON.stringify(this.id_done));
    console.log(this.id_done); // Log the array to check the stored ids
  }

  openDialog(userData?: User): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '400px',
      width: '400px',
      data: {
        title: userData?.title,
        content: userData?.content,
        _id: userData?._id,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
  }

  delete(id: any, indexNumber: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        }).then(() => {
          this._NoteService.DeleteUserNote(id, indexNumber).subscribe({
            next: (response) => {
              console.log(response);
              this.notes.splice(indexNumber, 1);
              this.ngOnInit();
            },
          });
        });
      }
    });
  }

  updateNote(noteDetail: User, noteIndex: number): void {
    console.log(noteDetail, noteIndex);
    this.openDialog({
      title: noteDetail.title,
      content: noteDetail.content,
      _id: noteDetail._id,
    });
  }

  signout(): void {
    localStorage.removeItem('token');
    this._Router.navigate(['/login']);
  }

  // Apply styles to notes that are marked as done
  applyStylesToDoneNotes(): void {
    this.notes.forEach((note) => {
      if (this.id_done.includes(note._id)) {
        note.done = true;
        const element = this._ElementRef.nativeElement.querySelector(
          `#note-${note._id}`
        );

        if (element) {
          // Apply styles only if the element is available
          const titleElement = element.querySelector('h4');
          const buttonElement = element.querySelector('.buttonDone');

          if (titleElement) {
            this._Renderer2.setStyle(
              titleElement,
              'text-decoration',
              'line-through'
            ); // Apply line-through style
            this._Renderer2.setStyle(titleElement, 'color', 'gray'); // Apply gray color
          }

          if (buttonElement) {
            this._Renderer2.setStyle(buttonElement, 'display', 'none'); // Hide the button
          }
        }
      }
    });
  }
}
