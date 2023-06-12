
export class metodosRepetidos {

    constructor() {
    }


    localNumero(lua : string) : number {
      switch (lua) {
        case "mexicali":
          return 1;
        case "calafia":
          return 2;
        case "sanLuis":
          return 3;
        case "palmira":
          return 4;
        case "hermosillo":
          return 5;
        case "general":
          return 0;
        default:
          return -1;
      }
    }

}
