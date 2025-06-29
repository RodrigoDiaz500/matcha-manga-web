import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatedPaymentComponent } from './simulated-payment.component';

describe('SimulatedPaymentComponent', () => {
  let component: SimulatedPaymentComponent;
  let fixture: ComponentFixture<SimulatedPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulatedPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulatedPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
