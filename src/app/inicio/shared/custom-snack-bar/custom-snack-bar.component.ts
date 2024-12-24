import { Component, Inject, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snack-bar',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, MatIconModule],
  template: `
    <span class="mensaje" matSnackBarLabel>
      {{ data }}
    </span>
    <span class="icon">
      <mat-icon>done_outline</mat-icon>
    </span>
  `
  ,
  styles: `
    span.icon {
    text-align: center;
    align-self: center;
}

.icon:not(.icon-c-s):not(.icon-custom-size) {
    width: 10%;
    height: 100%;
    font-size: 1rem;
}

    :host {
      display: flex;
    }

    .mensaje {
      text-align: center;
      color: white;
    }
  `
})

export class MensajeSnackBarComponent {
  @Input() titulo : string = '';
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {
  }
}
