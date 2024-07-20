import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../interface/user';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(notes: User[], value: string): any[] {
    return notes.filter((note) =>
      note.title.toLowerCase().includes(value.toLowerCase())
    );
  }
}
