import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import "rxjs/add/operator/map";

import { ToastController } from 'ionic-angular';

/*
  Generated class for the CargaArchivoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CargaArchivoProvider {

  imagenes: ArchivoSubir[] = [];
  lastKey: string = "";

  constructor(public toastCtrl: ToastController, public afDB: AngularFireDatabase) {
    this.cargarUltimoKey().subscribe(() => {
      this.cargarImagenes();
    });
  }

  cargarUltimoKey() {
    return this.afDB.list("/post", ref => ref.orderByKey().limitToLast(1)).valueChanges()
      .map((post: any) => {
        console.log(post)
        this.lastKey = post[0].key;

        this.imagenes.push(post[0])
      })
  }

  cargarImagenes() {
    return new Promise((resolve, reject) => {
      this.afDB.list("/post",
        ref => ref.limitToLast(3)
          .orderByKey()
          .endAt(this.lastKey)
      ).valueChanges().subscribe((posts: any) => {

        posts.pop();

        if (posts.length == 0) {
          console.log("Ya no hay mas registros")
          resolve(false)
          return;
        }

        this.lastKey = posts[0].key

        for(let i = posts.length-1; i>=0; i--){
          let post = posts[i];
          this.imagenes.push(post)

        }
        resolve(true)
      })
    });

  }


  cargarImagenFirebase(archivo: ArchivoSubir) {

    let promesa = new Promise((resolve, reject) => {
      this.mostrarToast("Cargando...")

      let storeRef = firebase.storage().ref();
      let nombreArchivo: string = new Date().valueOf().toString(); //11122131213 será el nombre de archivo (fecha)

      let uploadTask: firebase.storage.UploadTask =
        storeRef.child(`img/${nombreArchivo}`)
          .putString(archivo.img, 'base64', { contentType: 'image/jpeg' });


      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        () => { }, //saber el % de cuantos MBs se han subido
        (error) => {
          //manejo de error
          console.log("Error en la carga")
          console.log(JSON.stringify(error))
          this.mostrarToast(JSON.stringify(error))
          reject();
        },
        //Todo bien!!
        () => {
          console.log("Archivo subido");
          this.mostrarToast("Imagen cargada correctamente")

          let url = uploadTask.snapshot.downloadURL

          this.crearPost(archivo.titulo, url, nombreArchivo)

          resolve();
        }

      )
    });
    return promesa;
  }

  mostrarToast(mensaje: string) {
    this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    }).present()

  }

  private crearPost(titulo: string, url: string, nombreArchivo: string) {
    let post: ArchivoSubir = {
      img: url,
      titulo: titulo,
      key: nombreArchivo
    };
    console.log(JSON.stringify(post));

    // this.afDB.list("/post").push(post) así no se crea el nombre que queramos de key
    this.afDB.object(`post/${nombreArchivo}`).update(post) //así creamos el nombre que queramos de key

    this.imagenes.push(post)
  }

}

interface ArchivoSubir {
  titulo: string;
  img: string;
  key?: string;
}
