import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { UiService } from './ui.service';
import { Usuario } from '../interfaces/interface';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;
  private usuario: Usuario = {};
  playerID: string = null;

  constructor(private http: HttpClient,
              private storage: Storage,
              private ui: UiService,
              private navCtrl: NavController) { }


  async login(email: string, password: string) {
 
    await this.getPlayerID();
    const data = { email, password, playerID: this.playerID };

    return new Promise(resolve => {

      this.http.post(`${URL}/api/business/signin`, data)
        .subscribe(async resp => {

          console.log(resp);

          if (resp['status'] === 'ok') {

            await this.guardarToken(resp['token']);
            resolve(true);

          } else {
            this.token = null;
            this.storage.clear();
            resolve(false);
          }

        }, err => { resolve(false); });
    });

  }
  getUsuario() {

    if (!this.usuario || !this.usuario.tokenx) {
      this.validaToken();
    }

    return { ...this.usuario };

  }
  async setUsuario(usuario: Usuario) {
    await this.storage.set('usuario', usuario);
  }
  async validaToken(): Promise<boolean> {

    await this.cargarToken();

    if (!this.token) {
      console.log('NO HAY TOKEN [function validaToken]', this.token);
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }


    // SI TENEMOS UN TOKEN EN STORAGE, OBTENEMOS EL USUARIO, LO GUARDAMOS EN STORAGE
    return new Promise<boolean>(resolve => {
      console.log('GET USUARIO (HTTP)', this.token);

      const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
      this.http.get(`${URL}/api/business/get`, { headers })
        .subscribe(resp => {

          if (resp['status'] === 'ok') {

            this.usuario = resp['usuario'];
            this.setUsuario(this.usuario);
            resolve(true);
 
          } else {
            this.navCtrl.navigateRoot('/login');
            resolve(false);
          }

        }, error => {
          this.ui.alertaInformativa('Necesitas una conexión a internet.');
        });

    });

  }
  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }
  async guardarToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);
    await this.validaToken();
  }  
  async getPlayerID() {
    this.playerID = await this.storage.get('playerID') || null;
  }
}
