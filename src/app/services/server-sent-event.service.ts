import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerSentEventService {
  private token: string;
  private eventSource!: EventSource;
  private eventName!: string;
  private trigger = new Subject<void>();
  triggerObservable$ = this.trigger.asObservable();
  private headers: HttpHeaders;


  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const statusProgress = localStorage.getItem('status_progress');
    if (statusProgress) {
      const parseStatusProgress = JSON.parse(statusProgress);
      this.eventName = parseStatusProgress.job_id;
    }
  }

  triggerEvent() {
    this.trigger.next();
  }


  serverSentEventExcelInit(eventName: string): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
    this.eventName = eventName;
    this.eventSource = this.getEventSource(`${environment.backendUrl}/api/v1/excel/progress?eventName=${eventName}`);
  }

  closeEventSource(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  getServerSentEventImage(): Observable<MessageEvent> {
    return new Observable(observer => {
      if (this.eventSource === undefined) {
        observer.error('eventSource es undefined');
        return;
      }
      this.eventSource.addEventListener(`${this.eventName}image`, event => {
        observer.next(event);
      });

      this.eventSource.addEventListener('close', () => {
        this.eventSource.close();
        observer.complete();
      });

      this.eventSource.onerror = error => {
        if(this.eventSource.readyState === 0) {
          console.log('The stream has been closed by the server.');
          this.eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      };
    });
  }

  getServerSentEventChallenge(): Observable<MessageEvent> {
    return new Observable(observer => {
      if (this.eventSource === undefined) {
        observer.error('eventSource es undefined');
        return;
      }

      this.eventSource.addEventListener(`${this.eventName}challenge`, event => {
        observer.next(event);
      });

      this.eventSource.addEventListener('close', () => {
        this.eventSource.close();
        observer.complete();
      });

      this.eventSource.onerror = error => {
        if(this.eventSource.readyState === 0) {
          console.log('The stream has been closed by the server.');
          this.eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      };
    });
  }

  getServerSentEventPoc(): Observable<MessageEvent> {
    return new Observable(observer => {
      if (this.eventSource === undefined) {
        observer.error('eventSource es undefined');
        return;
      }

      this.eventSource.addEventListener(`${this.eventName}poc`, event => {
        observer.next(event);
      });

      this.eventSource.addEventListener('close', () => {
        this.eventSource.close();
        observer.complete();
      });

      this.eventSource.onerror = error => {
        if(this.eventSource.readyState === 0) {
          console.log('The stream has been closed by the server.');
          this.eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      };
    });
  }
  getServerSentEventStatus(): Observable<MessageEvent> {
    return new Observable(observer => {
      if (this.eventSource === undefined) {
        observer.error('eventSource es undefined');
        return;
      }

      this.eventSource.addEventListener(`${this.eventName}status`, event => {
        observer.next(event);
      });

      this.eventSource.addEventListener('close', () => {
        this.eventSource.close();
        observer.complete();
      });

      this.eventSource.onerror = error => {
        if(this.eventSource.readyState === 0) {
          console.log('The stream has been closed by the server.');
          this.eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      };
    });
  }

  private getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
  getEventName(): string {
    const statusProgress = localStorage.getItem('status_progress');
    this.eventName = statusProgress ? JSON.parse(statusProgress).job_id : '';
    return this.eventName;
  }
}
