import { Injectable, inject } from '@angular/core';
import { ContextService } from './context.service';
import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { Marcas } from '../models/marcas.model';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {

  private _ContextService = inject(ContextService);

  async get() {
    let result: Marcas[] = [];
    const querySnapshot = await getDocs(collection(this._ContextService.db, "marcas"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      let data: Marcas = {
        guid: doc.id,
        nombre: doc.data().nombre,
        isActive: doc.data().isActive
      };
      if (data.isActive) {
        result.push(data);
        result = this._ContextService.ordenarArray(result);
      }
    });
    return result;
  }

  async agregarElemento($event: any) {
    await setDoc(doc(this._ContextService.db, "marcas", this._ContextService.generateGUID()), {
      nombre: $event.data.nombre,
      isActive: true
    });
    //console.debug("Document written with ID: ", this.generateGUID());
  }

  async actualizarElemento($event: any) {
    const marcaRef = doc(this._ContextService.db, "marcas",  $event.oldData.guid);
    await updateDoc(marcaRef, {
      nombre: ($event.newData.nombre != undefined)? $event.newData.nombre: $event.oldData.nombre
    });
    //console.debug("Document written with ID: ", this.generateGUID());
  }

  async eliminarElemento($event: any) {
    const marcaRef = doc(this._ContextService.db, "marcas",  $event.data.guid);
    await updateDoc(marcaRef, {
      isActive: false
    });
  }
}
