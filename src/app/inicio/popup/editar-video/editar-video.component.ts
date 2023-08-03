import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, catchError, Subscription, concatMap, switchMap,Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EditarSliderComponent } from '../editar-slider/editar-slider.component';
import { AddAraizaAprendeComponent } from '../add-araiza-aprende/add-araiza-aprende.component';
import { RestAraizaAprendeComponent } from '../rest-araiza-aprende/rest-araiza-aprende.component';
import { categoriaInterfaz, temaInterfaz } from '../../opcion-config/araiza-aprende-config/araiza-aprende-config.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { AraizaAprendeService, videoAraizaAprende } from 'src/app/core/services/araiza_aprende.service';

export interface actNomImgVideo {
  imgn : string;
  img : string;
  idUsuario : number;
}

@Component({
  selector: 'app-editar-video',
  templateUrl: './editar-video.component.html',
  styleUrls: ['./editar-video.component.css']
})

export class EditarVideoComponent implements OnInit {


  insertarImagen : boolean = false
  hide = true;
  formData : FormData = new FormData();
  activar : boolean = false
  categorias : categoriaInterfaz  [] = [];
  temas : temaInterfaz  [] = [];
  formato : string = ""
   $sub : Subscription = new Subscription()
  targetFile : any
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");
  nombreActualizadoImgVid : boolean = false

  formAraizaAprende : FormGroup = this.fb.group({
    categoria : [this.data?.idCategoria.toString(), Validators.required],
    tema : [this.data?.idTema.toString(), Validators.required],
    nombre : [this.data?.nombre, Validators.required],
    link : [this.data?.link, Validators.required],
    input : [this.data?.link, Validators.required],
  })
  link : string =  environment.production === true ? "": "../../../";
  api : string = environment.api;


  constructor(private fb : FormBuilder,@Inject(MAT_DIALOG_DATA) public data: videoAraizaAprende,public dialogRef: MatDialogRef<EditarSliderComponent>,
  private dialog : NgDialogAnimationService,private service : AraizaAprendeService
  ) {

  }
  ngOnInit(): void {

  this.service.todoCategorias().subscribe((resp:ResponseInterfaceTs) =>{
    for (let i = 0; i < resp.container.length; i++) {
      this.categorias.push(resp.container[i]);
    }
  })

  this.service.todoTemas().subscribe((resp:ResponseInterfaceTs) =>{
    for (let i = 0; i < resp.container.length; i++) {
      this.temas.push(resp.container[i]);
    }
  })
  }



  async subirImg(evt : any){
    let target : any = <DataTransfer>(evt.target).files[0];
    const image = new Image();

    if (target.type.split("/")[0] == "image") {
      this.nombreActualizadoImgVid = true

    this.formAraizaAprende.patchValue({
      input : target.name
    })

    image.onload = () => {
      if( ((target.size/1024)<=2048 )){
        this.formato = target.type
        this.formData.append('info', target,target.name);
        this.formData.forEach((file :any)=> {
          this.formAraizaAprende.patchValue({
            imgVideo : file.name
          })
        });
      }else{
        alert("Solo se permiten imagenes menores o igual a 2MB");
        target  = new DataTransfer()
        let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
        inpimg2.value="";
        this.formAraizaAprende.patchValue({
          input : null
        })
      }
    }
    image.src = URL.createObjectURL(target);
    } else {
      target  = new DataTransfer()
      let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
      inpimg2.value="";
      this.formAraizaAprende.patchValue({
        input : null
      })
      alert('Solo se permiten imagenes')
    }
  }

  add( opc : number){
    let dialogRef = this.dialog.open(AddAraizaAprendeComponent, {
      height: 'auto',
      width: '450px',
      data: opc
    });
    if (opc==1) {
      dialogRef.afterClosed().subscribe(async (resp:categoriaInterfaz[])=>{
        if (resp != null) {
          this.categorias = [];
          for (let i = 0; i < resp.length; i++) {
            this.categorias.push(resp[i])
          }
        }
      })
    } else {
      dialogRef.afterClosed().subscribe(async (resp:temaInterfaz[])=>{
        if ( resp != null) {
          this.temas = [];
          for (let i = 0; i < resp.length; i++) {
            this.temas.push(resp[i])
          }
        }
      })
    }

  }

  rest( opc : number){
    let dialogRef = this.dialog.open(RestAraizaAprendeComponent, {
      height: 'auto',
      width: '450px',
      data: opc
    });
    if (opc==11) {
      dialogRef.afterClosed().subscribe(async (resp:categoriaInterfaz[])=>{
        if (resp != null) {
          this.categorias = [];
          for (let i = 0; i < resp.length; i++) {
            this.categorias.push(resp[i])
          }
        }
      })
    } else {
      dialogRef.afterClosed().subscribe(async (resp:temaInterfaz[])=>{
        if ( resp != null) {
          this.temas = [];
          for (let i = 0; i < resp.length; i++) {
            this.temas.push(resp[i])
          }
        }
      })
    }
  }

  async enviandoDatos() {
     if (this.formAraizaAprende.valid == false) {
      alert("Por favor llene todos los campos");
    } else {
      this.contenedor_carga.style.display = "block";

    //registrando id y formato
    let id = this.data.idArApr;
    let img = this.data.img;
    let formato = this.data.formato;
    this.data = this.formAraizaAprende.value;
    this.data.idArApr = id;
    this.data.formato = formato;
    this.data.img = img;
    let Observable : Observable<ResponseInterfaceTs>[] = [];

     //Se eliminara la anterior imagen, si esque se remplazo el actual
    if (this.nombreActualizadoImgVid === true) {
      /**0*/ Observable.push(this.service.eliminarDirImgVideo(Number(this.data.idArApr)))
      /**1*/ Observable.push(this.service.subirImagen(this.formData))
    }

      /**2*/ Observable.push(this.service.editarVideo(this.data))
      /**3*/ Observable.push(this.service.todoVideo())

    if (Observable.length == 4) {
      Observable[0].pipe(
        concatMap(()=>{
          return Observable[1].pipe(
            concatMap((resp:ResponseInterfaceTs)=>{
            this.data!.img = resp.container.nombre
            this.data!.formato = resp.container.formato
            return Observable[2].pipe(
              concatMap(() =>{
                return Observable[3]
              })
            )
          }))
        })
      ).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe((resp:ResponseInterfaceTs) =>{
          this.dialogRef.close(resp.container)
          this.contenedor_carga.style.display = "none";
        })
    }

    if (Observable.length == 2) {
      Observable[0].pipe(
        concatMap(() =>{
          return Observable[1]
        })
      ).pipe(
      catchError( _ => {
        throw "Error in source."
    })
    ).subscribe((resp:ResponseInterfaceTs) =>{
        this.dialogRef.close(resp.container)
        this.contenedor_carga.style.display = "none";
      })
    }
    }
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

}

