import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFolderDialComponent } from './delete-folder-dial.component';

describe('DeleteFolderDialComponent', () => {
  let component: DeleteFolderDialComponent;
  let fixture: ComponentFixture<DeleteFolderDialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteFolderDialComponent]
    });
    fixture = TestBed.createComponent(DeleteFolderDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
