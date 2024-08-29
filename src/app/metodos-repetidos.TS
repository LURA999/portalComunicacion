
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

    detectBrowser(): string {
      const userAgent = navigator.userAgent;

      if (/chrome|crios/i.test(userAgent) && !/edg|edge|opr|opera/i.test(userAgent)) {
        return 'Chrome';
      } else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) {
        return 'Safari';
      } else if (/firefox|fxios/i.test(userAgent)) {
        return 'Firefox';
      } else if (/edg|edge/i.test(userAgent)) {
        return 'Edge';
      } else if (/opr|opera/i.test(userAgent)) {
        return 'Opera';
      } else {
        return 'Otro';
      }
    }


}
