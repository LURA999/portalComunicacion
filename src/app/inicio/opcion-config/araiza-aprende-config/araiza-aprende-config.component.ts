import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { AddAraizaAprendeComponent } from '../../popup/add-araiza-aprende/add-araiza-aprende.component';
import { RestAraizaAprendeComponent } from '../../popup/rest-araiza-aprende/rest-araiza-aprende.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { AraizaAprendeService, videoAraizaAprende } from 'src/app/core/services/araiza_aprende.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { Subscription, catchError, concatMap, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { DataNavbarService } from 'src/app/core/services/data-navbar.service';


export interface categoriaInterfaz {
  idCatArApr : Number;
  categoria : String
}

export interface temaInterfaz {
  idTemaArApr : Number;
  tema : String
}


@Component({
  selector: 'app-araiza-aprende-config',
  templateUrl: './araiza-aprende-config.component.html',
  styleUrls: ['./araiza-aprende-config.component.css']
})
export class AraizaAprendeConfigComponent {

  formAraizaAprende : FormGroup = this.fb.group({
    categoria : ["", Validators.required],
    tema : ["", Validators.required],
    nombre : ["", Validators.required],
    link : ["", Validators.nullValidator],
    input : ["", Validators.required],
    titulo: ["", Validators.nullValidator],
    descripcion: ["", Validators.nullValidator],
    linkVideo: ["", Validators.nullValidator],
    linkForm: ["", Validators.nullValidator]
  })


  formData : FormData = new FormData();
  activar : boolean = false
  categorias : categoriaInterfaz  [] = [];
  temas : temaInterfaz  [] = [];
  formato : string = ""
   $sub : Subscription = new Subscription()

   paramUrl : string = this.route.url.split("/")[2];

  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");
  @ViewChild('miBoton') miBoton!: MatButton;

constructor(
  private fb : FormBuilder,
  private dialog : NgDialogAnimationService,
  private service : AraizaAprendeService,
  public route : Router,private DataService : DataNavbarService){

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

activarBut(){
  if (this.formAraizaAprende.valid === false ) {
    this.miBoton.disabled = false;
  }else{
    this.miBoton.disabled = true;
  }
}

async subirImg(evt : any){
  let target : any = <DataTransfer>(evt.target).files[0];
  const image = new Image();

  if (target.type.split("/")[0] == "image") {

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

  async enviandoDatos(){

    if (this.formAraizaAprende.valid == false) {
      alert("Por favor llene todos los campos");
    } else {
      this.miBoton.disabled = true;

      this.contenedor_carga.style.display = "block";
      this.activar = true

      this.$sub.add(this.service.subirImagen(this.formData).pipe(
        concatMap((resp:ResponseInterfaceTs) => {
          let video : videoAraizaAprende ={
            idCategoria : Number(this.formAraizaAprende.value['categoria']),
            idTema : Number(this.formAraizaAprende.value['tema']),
            img : resp.container.nombre,
            link : this.formAraizaAprende.value['link'],
            nombre : this.formAraizaAprende.value['nombre'],
            formato : this.formato,
            titulo: this.formAraizaAprende.value["titulo"],
            descripcion: this.formAraizaAprende.value["descripcion"],
            linkVideo: this.formAraizaAprende.value["linkVideo"],
            linkForm: this.formAraizaAprende.value["linkForm"]
          };

          return this.service.insertarVideo(video)
        })
        ).pipe(
        catchError( _ => {
          throw "Error in source."
      })
      ).subscribe(()=>{
          this.route.navigate(['general/galeriaMulti-config'])
            this.contenedor_carga.style.display = "none";
      }))

      this.contenedor_carga.style.display = "none";
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
        if (resp.length > 0) {
          this.categorias = [];
          for (let i = 0; i < resp.length; i++) {
            this.categorias.push(resp[i])
          }
        }
      })
    } else {
      dialogRef.afterClosed().subscribe(async (resp:temaInterfaz[])=>{
        if ( resp.length > 0 ) {
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
        if (resp.length > 0) {
          this.categorias = [];
          for (let i = 0; i < resp.length; i++) {
            this.categorias.push(resp[i])
          }
        }
      })
    } else {
      dialogRef.afterClosed().subscribe(async (resp:temaInterfaz[])=>{
        if ( resp.length > 0) {
          this.temas = [];
          for (let i = 0; i < resp.length; i++) {
            this.temas.push(resp[i])
          }
        }
      })
    }
  }

  ngAfterViewInit(): void {
    this.DataService.open.emit(this.paramUrl);

  }

}
