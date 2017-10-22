import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { SubirPage } from '../subir/subir';

import { SocialSharing } from '@ionic-native/social-sharing';



//firebase
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { CargaArchivoProvider } from '../../providers/carga-archivo/carga-archivo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  hayMas: boolean = true;

  // posts: Observable<any[]>;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private afDB: AngularFireDatabase,
    private _cap: CargaArchivoProvider, private socialSharing: SocialSharing) {
    // this.posts = afDB.list('post').valueChanges(); //post es el nombre del objeto
  }

  mostrarModal() {
    let modal = this.modalCtrl.create(SubirPage)

    modal.present()
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    this._cap.cargarImagenes().then(
      (hayMas: boolean) => {
        console.log(hayMas)
        this.hayMas = hayMas;
        infiniteScroll.complete()
      })

    console.log('Async operation has ended');


  }
  compartirFB(post:any) {
    // Share via email
    this.socialSharing.shareViaFacebook("Imagen compartida desde Firebase", post.img, post.img).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
}
