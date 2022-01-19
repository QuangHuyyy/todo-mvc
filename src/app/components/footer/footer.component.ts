import { Filter, FilterButton } from './../../models/filtering.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  filterButtons: FilterButton[] = [
    { type: Filter.ALL, label: 'All', isActive: true },
    { type: Filter.ACTIVE, label: 'Active', isActive: false },
    { type: Filter.COMPLETED, label: 'Completed', isActive: false },
  ];

  length: number = 0;
  constructor() {}

  ngOnInit(): void {}
}
