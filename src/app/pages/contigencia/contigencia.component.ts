import { Component } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contigencia',
  standalone: true,
  imports: [NzTabsModule,NzCardModule],
  templateUrl: './contigencia.component.html',
  styleUrl: './contigencia.component.scss'
})
export class ContigenciaComponent {
  index1 = 0;
  index2 = 0;
  constructor(private location: Location) { }

  getLocation(){
    console.group(this.location.path)
    const path = this.location.path();
    const segments = path.split('/');
    return segments[2]
  }

}
