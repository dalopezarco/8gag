import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {CargaArchivoProvider} from '../../providers/carga-archivo/carga-archivo';
//plugins
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {

  titulo: string="";
  imagenPreview: string = "";
  imagen64:string= "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private camera: Camera, private imagePicker: ImagePicker,
    public _cap:CargaArchivoProvider) {
  }

  cerrarModal() {
    this.viewCtrl.dismiss()
  }
  mostrarCamara() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
      this.imagen64 = imageData;
    }, (err) => {
      // Handle error
      console.log("ERROR EN CAMARA")
      console.log(JSON.stringify(err))
    });
  }

  seleccionarFoto() {
    let opciones:ImagePickerOptions = {
      quality:70,
      outputType:1,
      maximumImagesCount:1
    }

    this.imagePicker.getPictures(opciones).then((results) => {
      for (var i = 0; i < results.length; i++) {
        // console.log('Image URI: ' + results[i]);
        this.imagenPreview = 'data:image/jpeg;base64,' + results[i];
        this.imagen64 = results[i];

      }
    }, (err) => {
      console.log("Error en selector")
      console.log(JSON.stringify(err))
    });
  }

  crearPost(){
    let archivo = {
      img: this.imagen64,
      titulo:this.titulo
    }

    this._cap.cargarImagenFirebase(archivo).then(()=>this.cerrarModal())

  }
}
