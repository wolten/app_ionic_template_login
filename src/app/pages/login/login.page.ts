import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {  NavController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loading = false;
  loadingsignup = false;

  loginUser = {
    email: 'wolten@gmail.com',
    pass: 'bypass$$'
  };

  constructor(private usuarioService: UsuarioService,
              private navCtrl: NavController,
              private uiService: UiService) { }

  ngOnInit() {
  }
  async login(fLogin: NgForm) {

    if (fLogin.invalid) { return; }

    this.loading = true;

    const valido = await this.usuarioService.login(this.loginUser.email, this.loginUser.pass);

    if (valido) {
      this.loading = false;
      // navegar al tabs
      this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });

    } else {
      // mostrar alerta de usuario y contraseña no correctos
      this.loading = false;
      this.uiService.alertaInformativa('Usuario y contraseña no son correctos.');
    }


  }
}
