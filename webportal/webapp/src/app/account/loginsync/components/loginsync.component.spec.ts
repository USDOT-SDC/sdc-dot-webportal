import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { LoginSyncComponent } from './loginsync.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginSyncService } from '../services/loginsyncservice.service';
import { WindowToken } from '../../../../factories/window.factory';
import { CognitoService } from '../../../../services/cognito.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';

describe('LoginsyncComponent', () => {
    let component: LoginSyncComponent;
    let fixture: ComponentFixture<LoginSyncComponent>;
    let mockLoginSyncService: MockLoginSyncService;
    let mockWindow;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, MatCardModule],
            declarations: [ LoginSyncComponent, MockLoaderComponent, MockAlertComponent ],
            providers: [
                { provide: CognitoService, useClass: MockCognitoService },
                { provide: LoginSyncService, useClass: MockLoginSyncService },
                { provide: WindowToken, useValue: MockWindow }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginSyncComponent);
        //mockLoginSyncService = TestBed.get(LoginSyncService);
        //mockWindow = TestBed.get(WindowToken);
        mockLoginSyncService = TestBed.inject(LoginSyncService);
        mockWindow = TestBed.inject(WindowToken);
        component = fixture.componentInstance;
        component.username = 'the_username';
        component.password = 'the_password';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('redirects to DoT AD if the link type is DoT AD', () => {
        //spyOn(mockLoginSyncService, 'linkAccounts').and.returnValue(Observable.of({ signInType: 'dot_active_directory_user' }));
        spyOn(mockLoginSyncService, 'linkAccounts').and.returnValue(of({ signInType: 'dot_active_directory_user' }));

        fixture.debugElement.query(By.css('form')).triggerEventHandler('submit', null);
        fixture.detectChanges();

        expect(mockWindow.location.href).toEqual('dot_ad');
      });

    it('redirects to Login.gov if the link type is login.gov', () => {
        //spyOn(mockLoginSyncService, 'linkAccounts').and.returnValue(Observable.of({ signInType: 'login_gov_user' }));
        spyOn(mockLoginSyncService, 'linkAccounts').and.returnValue(of({ signInType: 'login_gov_user' }));

        fixture.debugElement.query(By.css('#signin_form')).triggerEventHandler('submit', null);
        fixture.detectChanges();

        expect(mockWindow.location.href).toEqual('login_gov');
    });

    it('shows the temporary password reset screen if the user signed in with a temporary password', () => {
        spyOn(mockLoginSyncService, 'linkAccounts').and.returnValue(Observable.throw({ userErrorMessage: 'Your password expired or whatever...',
                                                                                       body: { passwordExpired: true } }));

        fixture.debugElement.query(By.css('#signin_form')).triggerEventHandler('submit', null);
        fixture.detectChanges();

        expect(component.changeTemporaryPassword).toEqual(true);
        expect(component.errorMessage).toEqual("");
        expect(fixture.debugElement.nativeElement.querySelector('#temporary_credentials_form')).toBeTruthy();
    });

    describe('TemporaryCredentials', () => {
        beforeEach(() => {
            component.changeTemporaryPassword = true;
            fixture.detectChanges();
        });

        it('prevents invalid new passwords from submitting and shows an error message', () => {
            spyOn(mockLoginSyncService, 'resetTemporaryPassword').and.returnValue('I should not be called.');
            [{newPassword: '$h0rT', newPasswordConfirmation: '$h0rT', error: component.complexityErrorMessage},
             {newPassword: 'notComplexEnough', newPasswordConfirmation: 'notComplexEnough', error: component.complexityErrorMessage},
             {newPassword: 'noMatching$', newPasswordConfirmation: 'noMatch', error: component.passwordMatchingErrorMessage}].forEach(testCase => {
                component.newPassword = testCase.newPassword;
                component.newPasswordConfirmation = testCase.newPasswordConfirmation;

                fixture.debugElement.query(By.css('#temporary_credentials_form')).triggerEventHandler('submit', null);
                fixture.detectChanges();

                expect(mockLoginSyncService.resetTemporaryPassword).toHaveBeenCalledTimes(0);
                expect(fixture.debugElement.nativeElement.querySelector('#alert_show_alert').textContent).toBeTruthy();
                expect(fixture.debugElement.nativeElement.querySelector('#alert_show_alert').textContent).toEqual(testCase.error);
             });
        });

        it('it shows a nice error message if something bad happens during the password reset', () => {
            spyOn(mockLoginSyncService, 'resetTemporaryPassword').and.returnValue(Observable.throw({ userErrorMessage: 'Oh noes...', body: { } }));
            component.newPassword = 'Lets-Switch-To-React';
            component.newPasswordConfirmation = 'Lets-Switch-To-React';

            fixture.debugElement.query(By.css('#temporary_credentials_form')).triggerEventHandler('submit', null);
            fixture.detectChanges();

            expect(component.changeTemporaryPassword).toEqual(true);
            expect(mockLoginSyncService.resetTemporaryPassword).toHaveBeenCalledTimes(1);
            expect(fixture.debugElement.nativeElement.querySelector('#alert_show_alert').textContent).toBeTruthy();
            expect(fixture.debugElement.nativeElement.querySelector('#alert_text').textContent).toEqual( 'Oh noes...');
        });

        it('redirects the user to login.gov', () => {
            //spyOn(mockLoginSyncService, 'resetTemporaryPassword').and.returnValue(Observable.of({ signInType: 'login_gov_user' }));
            spyOn(mockLoginSyncService, 'resetTemporaryPassword').and.returnValue(of({ signInType: 'login_gov_user' }));
            component.newPassword = 'Lets-Switch-To-React';
            component.newPasswordConfirmation = 'Lets-Switch-To-React';

            fixture.debugElement.query(By.css('#temporary_credentials_form')).triggerEventHandler('submit', null);
            fixture.detectChanges();

            expect(mockWindow.location.href).toEqual('login_gov');
        });

        it('redirects the user to dot ad', () => {
            //spyOn(mockLoginSyncService, 'resetTemporaryPassword').and.returnValue(Observable.of({ signInType: 'dot_active_directory_user' }));
            spyOn(mockLoginSyncService, 'resetTemporaryPassword').and.returnValue(of({ signInType: 'dot_active_directory_user' }));
            component.newPassword = 'Lets-Switch-To-React';
            component.newPasswordConfirmation = 'Lets-Switch-To-React';

            fixture.debugElement.query(By.css('#temporary_credentials_form')).triggerEventHandler('submit', null);
            fixture.detectChanges();

            expect(mockWindow.location.href).toEqual('dot_ad');
        });
    });
});

@Component({
  selector: 'app-loader',
  template: ''
})
class MockLoaderComponent {
}

@Component({
  selector: 'app-alert',
  template: `<div id="alert_show_alert">{{showAlert}}</div><div id="alert_text">{{text}}</div>`
})
class MockAlertComponent {
  @Input() showAlert: boolean;
  @Input() text: string;
}

class MockCognitoService {
    buildLoginGovRedirectUrl() { return 'login_gov'; };
    buildDoTADRedirectUrl() { return 'dot_ad'; };
}

class MockLoginSyncService {
    linkAccounts(username, password) {};
    resetTemporaryPassword(username: string, currentPassword: string, newPassword: string, newPasswordConfirmation: string) {};
}

const MockWindow = {
  location: {
    _href: '',
    set href(url: string) {
      this._href = url;
    },
    get href() {
      return this._href;
    }
  }
};