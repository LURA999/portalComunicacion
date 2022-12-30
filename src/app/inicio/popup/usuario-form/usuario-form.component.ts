import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Subscription } from 'rxjs';
import { SubirImgVideoService } from 'src/app/core/services/img-video.service';
import { localService } from 'src/app/core/services/local.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ResponseInterfaceTs } from 'src/app/interfaces/response.interface';
import { local, usuarios } from '../../usuarios/usuarios.component';
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
    fechaIngreso: [ '' , Validators.required ]
  })

  constructor(private fb : FormBuilder,@Inject(MAT_DIALOG_DATA) public data: usuarios | undefined,public dialogRef: MatDialogRef<EditarSliderComponent>,
  private loc : localService, private usService : UsuarioService, private serviceImgVideo : SubirImgVideoService
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
        fechaIngreso: [  new Date(this.data!.fechaIngreso+"T00:00:00") , Validators.required ]
      })
      this.modalidad = false;
    }else{
      this.modalidad = true;
    }
   }

  subirImg(evt : any){
    this.insertarImagen = true
     this.targetFile = <DataTransfer>(evt.target).files[0];
    const reader= new FileReader()
    reader.readAsDataURL(this.targetFile )
    reader.onload = () => {
      this.formUsuario.patchValue({
        img : reader.result
      })
    }
    this.formData.append('info', this.targetFile, this.targetFile.name);
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
    //aqui envia datos dependiendo si se actualizara o si se inertara un nuevo usuario
    if (this.modalidad === true) {
      this.data = this.formUsuario.value
      //no es obligatorio insertar img, por lo tanto es necesario comprobar si se inserto una imagen
      if (this.insertarImagen == true) {
        this.formData.append('info', this.targetFile, this.data!.usuario.toString()+"."+this.targetFile.name.split(".")[1]);
        nombre = await (await lastValueFrom(this.serviceImgVideo.subirImgUsuario(this.formData))).container.nombre;
      }

      this.data!.img = nombre
      console.log(this.data);

      await lastValueFrom(this.usService.createuser(this.data!))
      this.usService.selectAllusers().subscribe(async (resp1:ResponseInterfaceTs) =>{
        this.dialogRef.close(await resp1.container);
      })
    } else {
      let id :number = this.data!.usuario;
      this.data = this.formUsuario.value
    //Se eliminara la anterior imagen, si esque se remplazo el actual
    if (this.insertarImagen === true) {
      this.formData.append('info', this.targetFile, this.data!.usuario.toString()+"."+this.targetFile.name.split(".")[1]);
      await lastValueFrom(this.serviceImgVideo.eliminarDirImgUsuario(id));
      //despues se actualizara la imagen nueva que eligio
       await lastValueFrom(this.serviceImgVideo.actualizarImgUsuario(this.data!.usuario.toString()+"."+this.targetFile.name.split(".")[1]));
       let datos = await (await lastValueFrom(this.serviceImgVideo.subirImgUsuario(this.formData))).container.nombre;
      this.data!.img = datos["nombre"];
      }

      this.data!.usuario = id
      // a continuación se actualizara los demas datos del usuario
      console.log(this.data);

      await lastValueFrom(this.usService.updateUser(this.data!))
      this.usService.selectAllusers().subscribe(async (resp1:ResponseInterfaceTs) =>{
        this.dialogRef.close(await resp1.container);
      })

    }
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

  seleccionandoHotel(){
    if (Number(this.formUsuario.value["cveLocal"]) == 0) {
      this.formUsuario.patchValue({
        cveRol: "1"
      })
    }else{
      this.formUsuario.patchValue({
        cveRol: "2"
      })
    }
  }

  seleccionandoRol(){
    if (Number(this.formUsuario.value["cveRol"]) == 1) {
      this.formUsuario.patchValue({
        cveLocal: "0"
      })
    }else{
      this.formUsuario.patchValue({
        cveLocal: "1"
      })
    }
  }
}
