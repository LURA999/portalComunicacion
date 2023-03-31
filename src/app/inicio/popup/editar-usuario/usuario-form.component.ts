import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, forkJoin, mergeMap, Subscription, concatMap, switchMap,Observable } from 'rxjs';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { localService } from 'src/app/core/services/local.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';
import { local, usuarios } from '../../opcion-config/usuarios-config/usuarios.component';
import { EditarSliderComponent } from '../editar-slider/editar-slider.component';

export interface actNomImgVideo {
  imgn : string;
  img : string;
  idUsuario : number;
}

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})

export class UsuarioFormComponent implements OnInit {
  insertarImagen : boolean = false
  hide = true;
  $sub : Subscription = new Subscription()
  locales : local [] = []
  formData : FormData = new FormData();
  modalidad : boolean = false;
  targetFile : any
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");

  formUsuario : FormGroup = this.fb.group({
    usuario : ["", Validators.required ],
    apellidoPaterno : ["", Validators.required ],
    apellidoMaterno : ["" ],
    correo : ["", Validators.required ],
    cveLocal : ["", Validators.required ],
    cveRol: [ "" , Validators.required ],
    nombres: [ "", Validators.required ],
    contrasena: [ '' ],
    img : [ '' ],
    fechaNacimiento: [ '' ],
    fechaIngreso: [ ''  ],
    departamento: [ '' , Validators.required ],
    contrato: [ '' , Validators.required ]
  })
  guardHotel : number | undefined
  link : string =  environment.production === true ? "": "../../../";
  api : string = environment.api;
  @ViewChild("subirImagen") inpImg : HTMLInputElement | undefined

  constructor(private fb : FormBuilder,@Inject(MAT_DIALOG_DATA) public data: usuarios | undefined,public dialogRef: MatDialogRef<EditarSliderComponent>,
  private loc : localService, private usService : UsuarioService, private serviceImgVideo : SubirImgVideoService, private changeDetectorRef: ChangeDetectorRef
  ) {
    if (data !== undefined) {
      this.formUsuario = this.fb.group({
        usuario : [this.data!.usuario, Validators.required],
        apellidoPaterno : [this.data!.apellidoPaterno, Validators.required],
        apellidoMaterno : [this.data!.apellidoMaterno],
        correo : [this.data!.correo, Validators.required],
        cveLocal : [Number(this.data!.cveLocal), Validators.required],
        cveRol: [ Number(this.data!.cveRol) , Validators.required],
        nombres: [ this.data!.nombres, Validators.required],
        contrasena: [ '' ],
        img : [ this.data!.img ],
        fechaNacimiento: [ new Date(this.data!.fechaNacimiento+"T00:00:00") ],
        fechaIngreso: [  new Date(this.data!.fechaIngreso+"T00:00:00") ],
        departamento: [ this.data!.departamento , Validators.required ],
        contrato: [ Number(this.data?.contrato) , Validators.required ]
      })
      this.guardHotel = Number(this.data!.cveLocal)
      this.modalidad = false;
    }else{
      this.modalidad = true;
    }
   }

  subirImg(evt : any){
    this.targetFile = <DataTransfer>(evt.target).files[0];

    if (this.targetFile.type.split("/")[0] === "image" && (this.targetFile.size/1024)<=2048) {
      this.insertarImagen = true

      const reader= new FileReader()
      reader.readAsDataURL(this.targetFile )
      reader.onload = () => {
        this.formUsuario.patchValue({
          img : this.targetFile.name
        })
      }
      this.formData.append('info', this.targetFile, this.targetFile.name);
    }else{
      if (this.targetFile.type.split("/")[0] !== "image") {
        alert("Solo se permiten subir imagenes");
      } else {
        alert("Solo se permiten subir imagenes menores o igual a 2MB");
      }
      this.targetFile  = new DataTransfer()
      let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
      inpimg2.value="";

    }

  }


  ngOnInit(): void {
    this.$sub.add(this.loc.todoLocal(-1).subscribe( async (resp:ResponseInterfaceTs) =>{
      for await (const i of resp.container) {
        this.locales.push({idLocal:i.idLocal, local:i.nombre})
      }
    }))
  }

  async enviandoDatos(){
    let nombre :string = ""
    /**
     * modalidad:
     * true = nuevo usuario
     * false = modificando usuario
     *
     * La variable modalidad tambien funciona para permitir el acceso de insertar nuevamente la imagen, cuando se necesite
     */

    //aqui envia datos dependiendo si se actualizara o si se inertara un nuevo usuario


    if (this.modalidad === true) {
      this.contenedor_carga.style.display = "block";
      let y : number = await (await lastValueFrom(this.usService.buscarRepetidoInsert(this.formUsuario.value["usuario"],Number(this.formUsuario.value["cveLocal"])))).container[0].total;
      this.contenedor_carga.style.display = "none";

      if(y == 0 && this.insertarImagen === true && this.formUsuario.valid === true){
      this.contenedor_carga.style.display = "block";

      this.data = this.formUsuario.value
      //no es obligatorio insertar img, pero es necesario comprobar si se inserto una imagen
        this.formData.append('info', this.targetFile, this.data!.usuario.toString()+"_"+this.formUsuario.value["cveLocal"]+"."+this.targetFile.name.split(".")[this.targetFile.name.split(".").length - 1]);
        this.serviceImgVideo.subirImgUsuario(this.formData).pipe(
          concatMap((res1:ResponseInterfaceTs) => {
              this.data!.img = res1.container.nombre
              return this.usService.createuser(this.data!).pipe(
              concatMap(() =>   this.usService.selectAllusers(1)))
          })).subscribe(async (res: ResponseInterfaceTs) => {
          this.dialogRef.close(await res.container);
          this.contenedor_carga.style.display = "none";
        });

    }else{
      if(this.formUsuario.valid === false){
        alert("Por favor acomplete todos los campos")
      } else if (this.insertarImagen === false) {
        alert("Por favor inserte la imagen")
      } else {
        alert("El usuario no se debe de repetir")
      }
    }
    } else {
      this.contenedor_carga.style.display = "block";
      let y : number = await (await lastValueFrom(this.usService.buscarRepetidoUpdate(this.formUsuario.value["usuario"],Number(this.formUsuario.value["cveLocal"]), this.data!.idUsuario))).container[0].total;
      this.contenedor_carga.style.display = "none";

      if(y == 0){

      let Observable : Observable<ResponseInterfaceTs>[] = [];

      this.contenedor_carga.style.display = "block";
      let gimg = this.data!.img;
      let cveLocal = this.data?.cveLocal //cvelocal anterior
      let usuario = Number(this.data?.usuario) //cvelocal anterior
      let idUsuario  = this.data!.idUsuario //protegiendo id
      this.data = this.formUsuario.value
      this.data!.idUsuario = idUsuario;
      this.data!.imgn = gimg; //Foto anterior
      this.data!.img = gimg?.split("_")[0]+"_"+this.formUsuario.value["cveLocal"]+"."+(gimg!.split(".")[gimg!.split(".").length - 1]) //Foto nueva
      this.data!.usuarion = usuario;


      if( Number(usuario) !==  Number(this.formUsuario.value["usuario"]) && this.insertarImagen === false) {
       let obj : actNomImgVideo ={
         idUsuario : this.data!.idUsuario,
         imgn: this.data!.imgn!,
         img: this.data!.usuario.toString()+"_"+this.formUsuario.value["cveLocal"]+"."+(gimg!.split(".")[gimg!.split(".").length - 1])
       }
       Observable.push(this.serviceImgVideo.renombrarImgUsuario(obj));
      }

    //Se eliminara la anterior imagen, si esque se remplazo el actual
      if (this.insertarImagen === true) {
        this.modalidad = true;
        this.formData.append('info', this.targetFile, this.data!.usuario.toString()+"_"+this.formUsuario.value["cveLocal"]+"."+this.targetFile.name.split(".")[this.targetFile.name.split(".").length - 1]);
        Observable.push(this.serviceImgVideo.eliminarDirImgUsuario(this.data!.usuario.toString()+"_"+this.formUsuario.value["cveLocal"]));
        Observable.push(this.serviceImgVideo.actualizarImgUsuario(this.data!.usuario.toString()+"_"+this.formUsuario.value["cveLocal"]+"."+this.targetFile.name.split(".")[this.targetFile.name.split(".").length - 1]));
        //despues se actualizara la imagen nueva que eligio
        Observable.push(this.serviceImgVideo.subirImgUsuario(this.formData))
      }

      Observable.push(this.usService.updateUser(this.data!, this.modalidad))

      Observable.push(this.usService.selectAllusers(1))


      if (Observable.length === 3) {
        this.$sub.add(Observable[0].pipe(
        concatMap(() => Observable[1].pipe(
          concatMap(() => Observable[2])
        ))).subscribe(async (resp:ResponseInterfaceTs)=>{
          this.dialogRef.close(await resp.container);
          this.contenedor_carga.style.display = "none";
        }))
      }

      if( Observable.length === 5) {
        this.$sub.add(Observable[0].pipe(
          concatMap(()=> Observable[1]),
          concatMap(() => Observable[2].pipe(
            concatMap((r2:ResponseInterfaceTs)=>{
              this.data!.img = r2.container.nombre
              return Observable[3]
            }),
            concatMap(() => {
              if(this.data!.imgn === this.data!.img){
                this.data!.img = '';
              }
              return Observable[4]
            })
          ))
        ).subscribe(async(resp:ResponseInterfaceTs)=>{
          this.dialogRef.close(await resp.container);
          this.contenedor_carga.style.display = "none";

        }))
      }

       if (Observable.length === 2) {
        if(this.data!.imgn === this.data!.img){
          this.data!.img = '';
        }
        this.$sub.add(Observable[0].pipe(
          concatMap(() => Observable[1])
          ).subscribe(async (resp:ResponseInterfaceTs)=>{
            this.dialogRef.close(await resp.container);
            this.contenedor_carga.style.display = "none";
          }))
        }

    }else{
      alert("El numero de usuario que desea actualizar, no se encuentra disponible")
    }
    }
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

  seleccionandoHotel(){
    if (Number(this.formUsuario.value["cveLocal"]) == 0) {
      this.formUsuario.patchValue({
        cveRol: 1
      })
    }else{
      this.formUsuario.patchValue({
        cveRol: 2
      })
    }
  }

  seleccionandoRol(){
    if (Number(this.formUsuario.value["cveRol"]) == 1) {
      this.formUsuario.patchValue({
        cveLocal: 0
      })
    }else{
      this.formUsuario.patchValue({
        cveLocal: 1
      })
    }
  }
}

