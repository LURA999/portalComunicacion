import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.css',
  standalone: true,
  imports: [MatGridListModule],
})
export class CreateQuestionComponent {

}
