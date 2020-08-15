import { bindFunctions, setConstants } from "./Utils";

export default class Module {
  constructor() {
    bindFunctions(this);
  }

  _d(constants) {
    setConstants(this, constants);
  }
}
