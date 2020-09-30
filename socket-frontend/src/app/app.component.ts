import { Component } from '@angular/core';
import { EditorService } from './services/editor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'document-editor';

  constructor(private editorService : EditorService) { }

  ngOnInit(): void {
  
  }


  //makes call to the backend server to create a new document
  createNewDocument() {
    this.editorService.createNewDocument();
  }
 
}
