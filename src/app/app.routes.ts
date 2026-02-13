import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MediaViewerComponent } from './media-viewer/media-viewer.component';
import { ChatComponent } from './chat/chat.component';
import { MediaBackendComponent } from './deprecated/media-backend/media-backend.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'media', component: MediaViewerComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'backend', component: MediaBackendComponent }
];
