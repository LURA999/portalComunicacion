import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { localService } from 'src/app/core/services/local.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';
import { environment } from 'src/environments/environment';
import { local, usuarios } from '../../opcion-config/usuarios-config/usuarios.component';
import { EditarSliderComponent } from '../editar-slider/editar-slider.component';

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
    apellidoMaterno : ["", Validators.required ],
    correo : ["", Validators.required ],
    cveLocal : ["", Validators.required ],
    cveRol: [ "" , Validators.required ],
    nombres: [ "", Validators.required ],
    contrasena: [ '' ],
    img : [ '' ],
    fechaNacimiento: [ '' , Validators.required],
    fechaIngreso: [ '' , Validators.required ],
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
        apellidoMaterno : [this.data!.apellidoMaterno, Validators.required],
        correo : [this.data!.correo, Validators.required],
        cveLocal : [this.data!.cveLocal, Validators.required],
        cveRol: [ this.data!.cveRol , Validators.required],
        nombres: [ this.data!.nombres, Validators.required],
        contrasena: [ '' ],
        img : [ this.data!.img ],
        fechaNacimiento: [ new Date(this.data!.fechaNacimiento+"T00:00:00"), Validators.required],
        fechaIngreso: [  new Date(this.data!.fechaIngreso+"T00:00:00") , Validators.required ],
        departamento: [ this.data!.departamento , Validators.required ],
        contrato: [ this.data?.contrato , Validators.required ]
      })
      this.guardHotel = Number(this.data!.cveLocal)
      this.modalidad = false;
    }else{
      this.modalidad = true;
    }
   }

  subirImg(evt : any){
    this.insertarImagen = true
    this.targetFile = <DataTransfer>(evt.target).files[0];

    if (this.targetFile.type.split("/")[0] === "image") {
      const reader= new FileReader()
      reader.readAsDataURL(this.targetFile )
      reader.onload = () => {
        this.formUsuario.patchValue({
          img : this.targetFile.name
        })
      }
      this.formData.append('info', this.targetFile, this.targetFile.name);
    }else{
      this.targetFile  = new DataTransfer()
      let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
      inpimg2.value="";
      alert("Solo se permiten subir imagenes");
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
      this.data = this.formUsuario.value
      //no es obligatorio insertar img, pero es necesario comprobar si se inserto una imagen
      if (this.insertarImagen === true) {
        this.formData.append('info', this.targetFile, this.data!.usuario.toString()+"_"+this.formUsuario.value["cveLocal"]+"."+this.targetFile.name.split(".")[this.targetFile.name.split(".").length - 1]);
        nombre = await (await lastValueFrom(this.serviceImgVideo.subirImgUsuario(this.formData))).container.nombre;
      }
      this.data!.img = nombre
      await lastValueFrom(this.usService.createuser(this.data!))
      this.$sub.add(this.usService.selectAllusers(1).subscribe(async (resp1:ResponseInterfaceTs) =>{
        this.dialogRef.close(await resp1.container);
      }))
    } else {
      this.contenedor_carga.style.display = "block";

      let gimg = this.data!.img;
      let cveLocal = this.data?.cveLocal //cvelocal anterior
      let usuario = Number(this.data?.usuario) //cvelocal anterior
      let idUsuario  = this.data!.idUsuario //protegiendo id
      this.data = this.formUsuario.value
      this.data!.idUsuario = idUsuario;
      this.data!.imgn = gimg; //Foto anterior
      this.data!.img = gimg?.split("_")[0]+"_"+this.formUsuario.value["cveLocal"]+"."+gimg?.split(".")[gimg?.split(".").length - 1] //Foto nueva
      this.data!.usuarion = usuario;

      console.log(this.data);

    //Se eliminara la anterior imagen, si esque se remplazo el actual
      if (this.insertarImagen === true) {
        this.modalidad = true;
        this.formData.append('info', this.targetFile, this.data!.usuario.toString()+"_"+this.formUsuario.value["cveLocal"]+"."+this.targetFile.name.split(".")[this.targetFile.name.split(".").length - 1]);
        await lastValueFrom(this.serviceImgVideo.eliminarDirImgUsuario(this.data!.usuario.toString()+"_"+this.formUsuario.value["cveLocal"]));
        await lastValueFrom(this.serviceImgVideo.actualizarImgUsuario(this.data!.usuario.toString()+"_"+this.formUsuario.value["cveLocal"]+"."+this.targetFile.name.split(".")[this.targetFile.name.split(".").length - 1]));
        //despues se actualizara la imagen nueva que eligio
        let datos = await (await lastValueFrom(this.serviceImgVideo.subirImgUsuario(this.formData))).container.nombre;
        this.data!.img = datos;
      }

      // this.data!.usuario = id
      // a continuación se actualizara los demas datos del usuario

      if(this.data!.imgn === this.data!.img){
        this.data!.img = '';
      }


      await lastValueFrom(this.usService.updateUser(this.data!, this.modalidad))

      /*   if (this.modalidad === false) {
          console.log(this.modalidad);

          console.log("cambiando imagen");

          if(Number(cveLocal) != Number(this.formUsuario.value["cveLocal"])) {
          this.formData.append('info', this.targetFile, this.data!.usuario.toString()+"_"+this.formUsuario.value["cveLocal"]+"."+this.targetFile.name.split(".")[this.targetFile.name.split(".").length - 1]);
          await lastValueFrom(this.serviceImgVideo.subirImgUsuario(this.formData));
        }
      } */

      this.$sub.add(this.usService.selectAllusers(1).subscribe(async (resp1:ResponseInterfaceTs) =>{
        this.dialogRef.close(await resp1.container);
        this.contenedor_carga.style.display = "none";

      }))

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

