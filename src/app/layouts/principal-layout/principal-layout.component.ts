import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-principal-layout',
  imports: [RouterOutlet],
  templateUrl: './principal-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrincipalLayoutComponent { }
