import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from '../admin-dashboard.component';
import { ProductService } from '../../../services/product.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs'; 

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let ngbModalSpy: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService',
      ['getAllProducts', 'getProductsByType', 'getProductById', 'addProduct', 'updateProduct', 'deleteProduct'], 
      { products$: of([]) } 
    );


    ngbModalSpy = jasmine.createSpyObj('NgbModal', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        AdminDashboardComponent, 
        CommonModule,
        NgbModalModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: NgbModal, useValue: ngbModalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});