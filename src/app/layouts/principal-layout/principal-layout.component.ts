import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-principal-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './principal-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrincipalLayoutComponent { }
