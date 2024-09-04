import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {OpenaiService} from "../../../services/ai-service";
import {DataService} from "../../../services/data-service";
import {MatListOption, MatSelectionList} from "@angular/material/list";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatStep, MatStepper, MatStepperPrevious} from "@angular/material/stepper";
import {Category} from "../../interfaces/category";
import {MatButton} from "@angular/material/button";
import {MatRadioButton} from "@angular/material/radio";
import {NgFor, NgForOf, NgIf} from "@angular/common";

@Component({
  standalone: true,
  selector: 'image-generator',
  templateUrl: './image-generator.component.html',
  imports: [
    MatSelectionList,
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    MatListOption,
    MatButton,
    MatStepperPrevious,
    MatRadioButton,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./image-generator.component.css']
})
export class ImageGeneratorComponent implements OnInit {
  @Output() imageSelected = new EventEmitter<string>();

  topic: string = '';
  theme: string = '';
  images: (string | undefined)[] = [];
  categories: Category[] = [];
  isLoading: boolean = false;
  artDetails1!: FormGroup;
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder, private openaiService: OpenaiService, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.getCategories().subscribe(categories => {
      this.categories =
        categories
      console.log(this.categories)
    })
    this.initArtDetails1Form()
  }

  private initArtDetails1Form() {
    this.artDetails1 = this.formBuilder.group({
          serviceDescription: ['', Validators.required]  
          });
  }
  trackByCategoryId(index: number, category: Category): number {
    return category.id;
  }


  async generateImages() {
    this.isLoading = true;
    try {
      const serviceDescription = this.artDetails1.get('serviceDescription')?.value;
      const prompt = `${serviceDescription}`;
      console.log(prompt);
  
      const response = await this.openaiService.generateImages(prompt);
      this.images = response.data.map((image: any) => image.url);
      console.log("this.images");
      console.log(this.images);
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      this.isLoading = false;
    }
  }
  

  async submitForm() {
    this.isSubmitted = true;
  
    const serviceDescription = this.artDetails1.get('serviceDescription')?.value;
  
    if (!serviceDescription) {
      console.error('Service description is required');
      return;
    }
  
    console.log('Service Description:', serviceDescription);
    await this.generateImages();
  }

  selectImage(imageUrl?: string) {
    this.imageSelected.emit(imageUrl);
  }
  
}
