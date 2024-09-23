import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { concatMap, map, Observable, of, startWith } from 'rxjs';
import { Equipo, votacionesEquipoService } from 'src/app/core/services/votaciones_equipo.service';
import { ResponseInterfaceTs } from 'src/app/interfaces_modelos/response.interface';

@Component({
  selector: 'app-crear-equipo-competencia',
  templateUrl: './crear-equipo-competencia.component.html',
  styleUrl: './crear-equipo-competencia.component.css'
})
export class CrearEquipoCompetenciaComponent {

  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");
  formData : FormData = new FormData();
  formato : string = "";
  optionsEquipo: Array<Equipo> = [];
  myControlUsuarios = new FormControl('');
  filteredOptionsEquipo!: Observable<Equipo[]>;
  cambiarImagen : boolean = false;

  formEquipo : FormGroup = this.fb.group({
    idEquipo : ["", Validators.nullValidator],
    nombreEquipo : ["", Validators.required],
    imgEquipo : ["", Validators.required],
  })



  constructor(
    private fb : FormBuilder,
    private veservice : votacionesEquipoService,
    public dialogRef: MatDialogRef<CrearEquipoCompetenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: boolean,
    private vce : votacionesEquipoService,
  ){
    this.vce.mostrarEquipos().subscribe( async (resp : ResponseInterfaceTs) => {
      if (resp.status.toString() === '200') {
        this.optionsEquipo = resp.container;
        this.filteredOptionsEquipo = this.myControlUsuarios.valueChanges.pipe(
          startWith(''),
          map(value => this._filterEquipo(value)),
        );
      }
    })
  }

  private _filterEquipo(value: any) : Equipo[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.nombreEquipo.toLowerCase();
    return this.optionsEquipo.filter(option => option.nombreEquipo.toLowerCase().includes(filterValue));
  }

  async subirImg(evt : any){
    let target : any = <DataTransfer>(evt.target).files[0];
    const image = new Image();

    if (this.data && !this.cambiarImagen) {
      this.cambiarImagen = true;
    }

    if (target.type.split("/")[0] == "image") {

    this.formEquipo.patchValue({
      input : target.name
    })

    image.onload = () => {
      if( ((target.size/1024)<=2048 )) {
        this.formato = target.type
        this.formData.append('info', target,target.name);
        this.formData.forEach((file :any) => {

          this.formEquipo.patchValue({
            imgEquipo : file.name
          })
        });
      } else {
        alert("Solo se permiten imagenes menores o igual a 2MB");
        target  = new DataTransfer()
        let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
        inpimg2.value="";
        this.formEquipo.patchValue({
          input : null
        })
      }
    }
    image.src = URL.createObjectURL(target);
    } else {
      target  = new DataTransfer()
      let inpimg2 : HTMLInputElement = <HTMLInputElement>document.getElementById("subir-imagen");
      inpimg2.value="";
      this.formEquipo.patchValue({
        input : null
      })
      alert('Solo se permiten imagenes')
    }
  }


  enviarDatos() {
    if (this.formEquipo.valid === false) {
      alert("Por favor ingrese los 2 campos requeridos");
    }else{
      this.contenedor_carga.style.display = "block";
      let arrObservable : Array<Observable<ResponseInterfaceTs>> = []

      if(this.cambiarImagen && this.data) {
        arrObservable.push(this.veservice.eliminarImg(Number(this.formEquipo.value['idEquipo'])))
      }

      arrObservable.push(this.veservice.subirVidImagen(this.formData).pipe(
        concatMap((resp: ResponseInterfaceTs) => {
         let img : Equipo = {
          idEquipo: this.formEquipo.value['idEquipo'],
          imgEquipo : resp.container.nombre,
          nombreEquipo : this.formEquipo.value['nombreEquipo'],
          formato : this.formato,
        };
        return this.veservice.crearEquipo(img)
      })))

      if (this.cambiarImagen && this.data ) {
        arrObservable[0].pipe(
          concatMap((resp:ResponseInterfaceTs) => {
            return arrObservable[1]
        })).subscribe()
      } else {
        arrObservable[0].subscribe()
      }

      this.dialogRef.close()
      this.contenedor_carga.style.display = "none";
    }
  }

  selectedUsuario(e : MatAutocompleteSelectedEvent) {
    this.myControlUsuarios.patchValue((
      (e.option.value as Equipo).nombreEquipo
    ))

    this.formEquipo.patchValue({
      idEquipo: (e.option.value as Equipo).idEquipo!,
      nombreEquipo : (e.option.value as Equipo).nombreEquipo,
      imgEquipo : (e.option.value as Equipo).imgEquipo
    })
    this.cambiarImagen = false;
  }
}
