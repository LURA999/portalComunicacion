import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoImgAraizaAprComponent } from './video-img-araiza-apr.component';

describe('VideoImgAraizaAprComponent', () => {
  let component: VideoImgAraizaAprComponent;
  let fixture: ComponentFixture<VideoImgAraizaAprComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoImgAraizaAprComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoImgAraizaAprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
